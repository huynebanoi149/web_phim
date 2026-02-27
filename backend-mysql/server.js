const express = require("express");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json()); // quan trọng để đọc body JSON

/* ================= TEST API ================= */
app.get("/test", (req, res) => {
  res.json({ message: "API working" });
});

/* ================= GET USERS ================= */
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

/* ================= CREATE USER ================= */
app.post("/users", (req, res) => {
  const { username, email, password, gender, role } = req.body;

  const sql = `
    INSERT INTO users (username, email, password, gender, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [username, email, password, gender, role], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "User created",
      id: result.insertId,
    });
  });
});

/* ================= UPDATE USER ================= */
app.put("/users/:id", (req, res) => {
  const { username, email, password, gender, role } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE users 
    SET username=?, email=?, password=?, gender=?, role=?
    WHERE id=?
  `;

  db.query(sql, [username, email, password, gender, role, id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "User updated successfully"
    });
  });
});

/* ================= DELETE USER ================= */
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "User deleted successfully"
    });
  });
});


/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});