// api/checkout.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Must be POST' });

    const { amount, product_name } = req.body;

    try {
        const response = await axios.post('https://api.paykasir.id/v1/transaction/create', {
            // Kita masukkan Slug dan API Key ke dalam body request
            slug: process.env.PAYKASIR_SLUG, 
            api_key: process.env.PAYKASIR_API_KEY,
            amount: amount,
            display_name: product_name,
            merchant_order_id: "INV-" + Date.now(),
            callback_url: `https://${process.env.VERCEL_URL}/api/callback`,
            return_url: `https://${process.env.VERCEL_URL}/success.html`
        });

        res.status(200).json(response.data);
    } catch (error) {
        // Log error untuk debug di Vercel Dashboard
        console.error("Error Paykasir:", error.response?.data || error.message);
        res.status(500).json({ error: 'Gagal membuat invoice' });
    }
}
