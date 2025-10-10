import jwt from 'jsonwebtoken';

// Middleware để xác thực token và phân quyền người dùng
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ' });

    req.user = decoded;
    next();
  });
};

// Middleware để kiểm tra quyền admin
export const verifyAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Chỉ admin mới được phép" });
  }
};

export default { verifyToken, verifyAdmin };