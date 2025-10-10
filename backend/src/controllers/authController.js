import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Đăng ký
export const register = async (req, res) => {
  try {
    const { username, email, password, gender, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, gender, role });
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log("Login user:", user._id, "Generated token:", token);

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Lấy danh sách tất cả user 
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, gender } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, gender },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    res.json({ message: "Cập nhật thành công", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

    const hashedPassword = await bcrypt.hash(newPass, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sửa thông tin 1 user (dành cho admin)
export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, gender, role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { username, gender, role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json({
      message: "Cập nhật user thành công",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Xoá user (chỉ admin mới có quyền)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json({ message: "Đã xoá user thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export default { register, login, getUsers, getProfile, updateUser, changePassword, updateUserByAdmin, deleteUser }; 