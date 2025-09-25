require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API endpoint for contact form
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Nexvian Contact: ${subject}`,
      text: `From: ${name} (${email})\n\n${message}`,
    });

    res.json({ success: true, msg: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Error sending message" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
