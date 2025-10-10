import mongoose from 'mongoose';

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
  type: String,
  required: true,
  enum: ['nam', 'nữ', 'không xác định'],
  lowercase: true,
  default: 'không xác định'
},

    role: {
    type: String,
  },
  favorites: [{ type: Number, ref: "Movie" }]

}, { timestamps: true });

export default mongoose.model('User', userSchema);
