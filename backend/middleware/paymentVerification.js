const crypto = require('crypto');

/**
 * Payme Basic Auth tekshiruvi
 * Authorization: Basic base64(Paycom:SECRET_KEY)
 */
function verifyPaymeAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) {
    return res.status(401).json({ error: { code: -32504, message: 'Token invalid' }, id: req.body?.id });
  }

  try {
    const base64 = auth.replace('Basic ', '');
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    const [login, password] = decoded.split(':');

    const expectedPassword = process.env.PAYME_SECRET_KEY || '';
    if (login !== 'Paycom' || password !== expectedPassword) {
      return res.status(401).json({ error: { code: -32504, message: 'Token invalid' }, id: req.body?.id });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: { code: -32504, message: 'Token invalid' }, id: req.body?.id });
  }
}

/**
 * Click SIGN string MD5 tekshiruvi
 */
function verifyClickSign(req, res, next) {
  const { click_trans_id, service_id, merchant_trans_id, merchant_prepare_id, amount, action, sign_time, sign_string } = req.body;

  if (!sign_string) {
    return res.status(400).json({ error: -1, error_note: 'SIGN CHECK FAILED!' });
  }

  const secretKey = process.env.CLICK_SECRET_KEY || '';
  // action=0 (prepare): no merchant_prepare_id in sign string
  // action=1 (complete): merchant_prepare_id (our MongoDB _id) included in sign string
  const signBase = Number(action) === 1
    ? `${click_trans_id}${service_id}${secretKey}${merchant_trans_id}${merchant_prepare_id}${amount}${action}${sign_time}`
    : `${click_trans_id}${service_id}${secretKey}${merchant_trans_id}${amount}${action}${sign_time}`;

  const expectedSign = crypto.createHash('md5').update(signBase).digest('hex');

  // Timing-safe comparison
  const bufA = Buffer.alloc(32); bufA.write(sign_string || '');
  const bufB = Buffer.alloc(32); bufB.write(expectedSign);
  if (!crypto.timingSafeEqual(bufA, bufB)) {
    return res.status(400).json({ error: -1, error_note: 'SIGN CHECK FAILED!' });
  }
  next();
}

module.exports = { verifyPaymeAuth, verifyClickSign };
