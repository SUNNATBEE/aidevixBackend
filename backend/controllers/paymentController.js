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

module.exports = { initiatePayment, paymentCallback, getMyPayments };
