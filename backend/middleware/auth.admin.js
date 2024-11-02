const authorizeAdmin = (req, res, next) => {
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin rights required.' });
    }
    next();
  };