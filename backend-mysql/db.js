const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456", // mật khẩu bạn vừa đặt
  database: "moviedb", // đổi đúng tên DB của bạn
});

db.connect((err) => {
  if (err) {
    console.log("❌ Lỗi kết nối:", err);
  } else {
    console.log("✅ MySQL Connected!");
  }
});

module.exports = db;