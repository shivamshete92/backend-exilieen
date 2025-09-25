const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express(); // ✅ DEFINE app before using it
const PORT = process.env.PORT || 5000;

// ✅ CORS
const allowedOrigins = [
  "https://exilieen-full-stack-frontend.onrender.com",
  "https://exilieen-tejas-frontend.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use(express.json());

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// ✅ CONTACT endpoint
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  console.log("📨 New contact:", req.body);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "mahakaltejas686@gmail.com",
        pass: process.env.EMAIL_PASS || "esrr qzye mcsf aznt",
      },
    });

    await transporter.sendMail({
      from: email,
      to: [
        "tmahakal46@gmail.com",
        "tejasmahakal740@gmail.com"
      ],
      subject: `Contact Form - ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ success: true, message: "✅ Message sent to both recipients!" });
  } catch (err) {
    console.error("❌ Mail Error:", err);
    res.status(500).json({ success: false, message: "Failed to send message", error: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
