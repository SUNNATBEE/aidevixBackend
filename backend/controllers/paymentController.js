const Payment    = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Course     = require('../models/Course');

/**
 * To'lov tizimi — Payme va Click uchun placeholder
 * Haqiqiy integratsiya uchun PAYME_MERCHANT_ID va CLICK_SERVICE_ID env o'zgaruvchilarini to'ldiring
 */

/** @desc  To'lovni boshlash | @route POST /api/payments/initiate | @access Private */
const initiatePayment = async (req, res) => {
  try {
    const { courseId, provider = 'payme' } = req.body;
    if (!courseId) return res.status(400).json({ success: false, message: 'courseId majburiy' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Kurs topilmadi' });
    if (course.isFree) return res.status(400).json({ success: false, message: 'Bu kurs bepul' });

    const existing = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (existing && existing.paymentStatus === 'paid')
      return res.status(400).json({ success: false, message: 'Siz bu kursni allaqachon sotib olgansiz' });

    const payment = await Payment.create({
      userId: req.user._id,
      courseId,
      amount: course.price,
      provider,
      status: 'pending',
    });

    // Payme / Click URL generatsiya (placeholder)
    let paymentUrl = null;
    if (provider === 'payme') {
      const merchantId = process.env.PAYME_MERCHANT_ID || 'YOUR_MERCHANT_ID';
      const encoded = Buffer.from(`m=${merchantId};ac.order_id=${payment._id};a=${course.price * 100}`).toString('base64');
      paymentUrl = `https://checkout.paycom.uz/${encoded}`;
    } else if (provider === 'click') {
      const serviceId = process.env.CLICK_SERVICE_ID || 'YOUR_SERVICE_ID';
      paymentUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${serviceId}&amount=${course.price}&transaction_param=${payment._id}`;
    }

    res.status(201).json({
      success: true,
      message: 'To\'lov boshlandi',
      data: { payment: { _id: payment._id, amount: payment.amount, provider, status: 'pending' }, paymentUrl },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  To'lov callback (Payme/Click webhook) | @route POST /api/payments/callback | @access Public */
const paymentCallback = async (req, res) => {
  try {
    const { transaction_id, status } = req.body;

    const payment = await Payment.findById(transaction_id);
    if (!payment) return res.status(404).json({ success: false, message: 'To\'lov topilmadi' });

    if (status === 'success' || status === 2) {
      payment.status = 'completed';
      payment.paidAt = new Date();
      payment.providerResponse = req.body;
      await payment.save();

      // Enrollment yaratish
      await Enrollment.findOneAndUpdate(
        { userId: payment.userId, courseId: payment.courseId },
        { userId: payment.userId, courseId: payment.courseId, paymentStatus: 'paid', paymentId: payment._id },
        { upsert: true, new: true },
      );
      await Course.findByIdAndUpdate(payment.courseId, { $inc: { studentsCount: 1 } });
    } else if (status === 'failed' || status === -1) {
      payment.status = 'failed';
      await payment.save();
    }

    res.json({ success: true, message: 'Callback qabul qilindi' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  To'lov tarixi | @route GET /api/payments/my | @access Private */
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('courseId', 'title thumbnail')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { payments } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  To'lov holatini tekshirish | @route GET /api/payments/:id/status | @access Private */
const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('courseId', 'title price');
    if (!payment) return res.status(404).json({ success: false, message: 'To\'lov topilmadi' });

    // 30 daqiqadan oshgan pending to'lovni expired qilish
    if (payment.status === 'pending') {
      const ageMinutes = (Date.now() - payment.createdAt.getTime()) / (1000 * 60);
      if (ageMinutes > 30) {
        payment.status = 'expired';
        payment.expiredAt = new Date();
        await payment.save();
      }
    }

    res.json({ success: true, data: { payment } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Payme metodlari ──────────────────────────────────────────────────────────

const checkPerformTransaction = async (params, id) => {
  const { account, amount } = params;
  const payment = await Payment.findOne({ _id: account?.order_id, status: 'pending' });
  if (!payment) return { error: { code: -31050, message: 'To\'lov topilmadi' }, id };
  if (payment.amount * 100 !== amount) return { error: { code: -31001, message: 'Noto\'g\'ri summa' }, id };
  return { result: { allow: true }, id };
};

const createPaymeTransaction = async (params, id) => {
  const { id: providerTxId, time, amount, account } = params;
  const payment = await Payment.findById(account?.order_id);
  if (!payment) return { error: { code: -31050, message: 'To\'lov topilmadi' }, id };
  if (payment.amount * 100 !== amount) return { error: { code: -31001, message: 'Noto\'g\'ri summa' }, id };

  if (payment.providerTransactionId && payment.providerTransactionId !== providerTxId) {
    return { error: { code: -31099, message: 'Boshqa tranzaksiya mavjud' }, id };
  }

  payment.providerTransactionId = providerTxId;
  payment.status = 'pending';
  await payment.save();

  return { result: { create_time: time, transaction: payment._id.toString(), state: 1 }, id };
};

const performTransaction = async (params, id) => {
  const { id: providerTxId } = params;
  const payment = await Payment.findOne({ providerTransactionId: providerTxId });
  if (!payment) return { error: { code: -31003, message: 'Tranzaksiya topilmadi' }, id };
  if (payment.status === 'completed') {
    return { result: { transaction: payment._id.toString(), perform_time: payment.paidAt.getTime(), state: 2 }, id };
  }

  payment.status = 'completed';
  payment.paidAt = new Date();
  await payment.save();

  // Enrollment yaratish
  await Enrollment.findOneAndUpdate(
    { userId: payment.userId, courseId: payment.courseId },
    { userId: payment.userId, courseId: payment.courseId, paymentStatus: 'paid', paymentId: payment._id },
    { upsert: true, new: true }
  );
  await Course.findByIdAndUpdate(payment.courseId, { $inc: { studentsCount: 1 } });

  return { result: { transaction: payment._id.toString(), perform_time: payment.paidAt.getTime(), state: 2 }, id };
};

const cancelTransaction = async (params, id) => {
  const { id: providerTxId, reason } = params;
  const payment = await Payment.findOne({ providerTransactionId: providerTxId });
  if (!payment) return { error: { code: -31003, message: 'Tranzaksiya topilmadi' }, id };

  payment.status = 'cancelled';
  payment.providerData = { ...payment.providerData, cancelReason: reason };
  await payment.save();

  return { result: { transaction: payment._id.toString(), cancel_time: Date.now(), state: -1 }, id };
};

/** @desc  Payme JSON-RPC webhook | @route POST /api/payments/payme | @access Public */
const handlePayme = async (req, res) => {
  const { method, params, id } = req.body;
  try {
    switch (method) {
      case 'CheckPerformTransaction': return res.json(await checkPerformTransaction(params, id));
      case 'CreateTransaction':       return res.json(await createPaymeTransaction(params, id));
      case 'PerformTransaction':      return res.json(await performTransaction(params, id));
      case 'CancelTransaction':       return res.json(await cancelTransaction(params, id));
      default: return res.json({ error: { code: -32601, message: 'Method not found' }, id });
    }
  } catch (err) {
    console.error('Payme error:', err.message);
    return res.json({ error: { code: -31008, message: err.message }, id });
  }
};

// ─── Click metodlari ──────────────────────────────────────────────────────────

/** @desc  Click prepare | @route POST /api/payments/click/prepare | @access Public */
const clickPrepare = async (req, res) => {
  try {
    const { merchant_trans_id, amount, action } = req.body;
    if (action !== 0) return res.json({ error: -3, error_note: 'Noto\'g\'ri action' });

    const payment = await Payment.findById(merchant_trans_id);
    if (!payment) return res.json({ error: -5, error_note: 'To\'lov topilmadi' });
    if (payment.amount !== Number(amount)) return res.json({ error: -2, error_note: 'Noto\'g\'ri summa' });
    if (payment.status === 'completed') return res.json({ error: -4, error_note: 'To\'lov allaqachon yakunlangan' });

    res.json({ click_trans_id: req.body.click_trans_id, merchant_trans_id, error: 0, error_note: 'Success' });
  } catch (err) {
    res.json({ error: -8, error_note: err.message });
  }
};

/** @desc  Click complete | @route POST /api/payments/click/complete | @access Public */
const clickComplete = async (req, res) => {
  try {
    const { merchant_trans_id, error: clickError } = req.body;
    const payment = await Payment.findById(merchant_trans_id);
    if (!payment) return res.json({ error: -5, error_note: 'To\'lov topilmadi' });

    if (Number(clickError) < 0) {
      payment.status = 'failed';
      await payment.save();
      return res.json({ click_trans_id: req.body.click_trans_id, merchant_trans_id, error: 0, error_note: 'Cancelled' });
    }

    payment.status = 'completed';
    payment.paidAt = new Date();
    payment.providerTransactionId = req.body.click_trans_id;
    await payment.save();

    await Enrollment.findOneAndUpdate(
      { userId: payment.userId, courseId: payment.courseId },
      { userId: payment.userId, courseId: payment.courseId, paymentStatus: 'paid', paymentId: payment._id },
      { upsert: true, new: true }
    );
    await Course.findByIdAndUpdate(payment.courseId, { $inc: { studentsCount: 1 } });

    res.json({ click_trans_id: req.body.click_trans_id, merchant_trans_id, error: 0, error_note: 'Success' });
  } catch (err) {
    res.json({ error: -8, error_note: err.message });
  }
};

module.exports = { initiatePayment, paymentCallback, getMyPayments, getPaymentStatus, handlePayme, clickPrepare, clickComplete };
