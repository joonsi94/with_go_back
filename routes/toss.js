const express = require('express');
const router = express.Router();
const axios = require('axios');


// ✅ 1. 결제 준비 API (결제창 URL 발급)
router.post("/pay", async (req, res) => {
  const { orderId, amount, orderName, customerName } = req.body;
  const TossKey = process.env.TOSS_SECRET_KEY;

  // ✅ 로그 찍기
  console.log("🎯 [PAY] 요청 데이터:", { orderId, amount, orderName, customerName });
  console.log("🔐 TossKey:", TossKey);
  console.log("✅ successUrl:", process.env.CLIENT_SUCCESS_URL);

  try {
    const response = await axios.post("https://api.tosspayments.com/v1/payments", {
      orderId,
      amount,
      orderName,
      successUrl: process.env.CLIENT_SUCCESS_URL,
      failUrl: process.env.CLIENT_FAIL_URL,
      customerName
    }, {
      headers: {
        Authorization: `Basic ${Buffer.from(TossKey + ":").toString("base64")}`,
        "Content-Type": "application/json"
      }
    });

    res.json({ url: response.data.checkout.url });
  } catch (err) {
    console.error("❌ [PAY] 결제 준비 실패:", err.response?.data || err.message);
    res.status(500).json({ error: "결제 준비 실패", details: err.response?.data });
  }
  console.log("📦 Toss로 보내는 데이터:", {
    orderId,
    amount,
    orderName,
    customerName,
    successUrl: process.env.CLIENT_SUCCESS_URL,
    failUrl: process.env.CLIENT_FAIL_URL
  });
});


// ✅ 2. 결제 승인 API (결제 완료 후 Toss에 최종 승인 요청)
router.post("/confirm", async (req, res) => {
  const { paymentKey, orderId, amount } = req.body;

  try {
    const response = await axios.post("https://api.tosspayments.com/v1/payments/confirm", {
      paymentKey,
      orderId,
      amount
    }, {
      headers: {
        Authorization: `Basic ${Buffer.from(TossKey + ":").toString("base64")}`,
        "Content-Type": "application/json"
      }
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "결제 승인 실패", details: err.response?.data });
  }
});


module.exports = router;