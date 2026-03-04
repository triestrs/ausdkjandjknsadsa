// api/checkout.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { amount, customer_name } = req.body;

    // Hit ke API Paykasir
    const response = await axios.post('https://api.paykasir.id/v1/transaction/create', {
      amount: amount,
      merchant_order_id: `ORDER-${Date.now()}`,
      customer_name: customer_name,
      callback_url: `https://${process.env.VERCEL_URL}/api/callback`,
      return_url: `https://${process.env.VERCEL_URL}/success`,
    }, {
      headers: { 'Authorization': `Bearer ${process.env.PAYKASIR_API_KEY}` }
    });

    // Kirim URL pembayaran ke frontend
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
