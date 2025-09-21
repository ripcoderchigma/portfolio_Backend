// server.js (Node.js + Express)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
})); // React aur Node connect karne ke liye zaroori

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
    user: process.env.MY_EMAIL,
    pass: process.env.EMAIL_PASS
  }
})

app.get("/api/message", (req, res) => {
  res.json({
      status : 200,
      success : true,
      reply : ` we got your get request...!`
  })
})

app.get("/api/debug-env", (req, res) => {
  res.json({
    MY_EMAIL: process.env.MY_EMAIL ? "✅ Loaded" : "❌ Not Found",
    EMAIL_PASS: process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Not Found"
  });
});

app.post("/api/message", async (req, res) => {
  const {name, email, mailSub, message} = req.body;
  console.log(`senderName : ${name}\nsenderEmail : ${email}`);

  try{

    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      replyTo: email,
      to: process.env.MY_EMAIL,
      subject: mailSub,
      text: `
      Visiter's Name: ${name}
      Visiter's Email: ${email}
      
      Visiter's message from your portfolio Website: ${message}
      `
    })

    res.json({
      status : 200,
      success : true,
      reply : `hi ${name}, we got your mail successfully...!`
    })
  }catch(err){
    console.error("Mail error:", err);
    res.status(500).json({ success: false, message: "Mail sending failed!" });
  }

  
})

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
