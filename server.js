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
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `Message from ${name}`,
      text: message
    });

    console.log(`[SUCCESS] Message sent from ${name} <${email}>`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("[ERROR] Sending mail failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

