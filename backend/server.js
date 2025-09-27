const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS setup
const allowedOrigins = [
  "http://13.62.101.151",                        // EC2 frontend (IP)
  "https://exilieen-full-stack-frontend.onrender.com",
  "https://exilieen-tejas-frontend.onrender.com",
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
}));

app.use(express.json());

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// ✅ CONTACT endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  console.log("📨 New contact form submission:", req.body);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // set in .env
        pass: process.env.EMAIL_PASS,  // set in .env (App Password)
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: [
        "tmahakal46@gmail.com",
        "tejasmahakal740@gmail.com"
      ],
      subject: `Contact Form - ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ success: true, message: "✅ Message sent successfully!" });
  } catch (err) {
    console.error("❌ Mail Error:", err);
    res.status(500).json({ success: false, message: "Failed to send message", error: err.message });
  }
});

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on http://0.0.0.0:${PORT}`);
});
