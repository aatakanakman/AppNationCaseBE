const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, 'my_secret_jwt');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

function requireAdmin(req, res, next) {
  console.log(req.user);
  if (req.user && req.user.role === 'ADMIN') {
    next(); // admin yetkisi varsa, bir sonraki middleware'a veya route handler'a geç
  } else {
    res.status(403).send({
      success: false,
      message: 'Access denied. Admin permission required.',
    });
  }
}

module.exports = { auth, requireAdmin };
