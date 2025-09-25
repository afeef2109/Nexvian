// server.js
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// CONTACT ROUTE
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if(!name || !email || !message){
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,       // your Gmail
        pass: process.env.ADMIN_PASSWORD    // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `Message from ${name}`,
      text: message
    });

    res.status(200).json({ success: true });
    console.log(`Message sent from ${name} <${email}>`);
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
