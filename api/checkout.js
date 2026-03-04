import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Harus POST' });

    try {
        const { amount, product_name } = req.body;

        // Cek apakah ENV sudah masuk
        if (!process.env.PAYKASIR_API_KEY || !process.env.PAYKASIR_SLUG) {
            return res.status(500).json({ error: 'ENV API_KEY atau SLUG belum diset di Vercel' });
        }

        const response = await axios.post('https://api.paykasir.id/v1/transaction/create', {
            slug: process.env.PAYKASIR_SLUG,
            api_key: process.env.PAYKASIR_API_KEY,
            amount: amount,
            merchant_order_id: "INV-" + Date.now(),
            product_name: product_name,
            callback_url: `https://${process.env.VERCEL_URL}/api/callback`,
            return_url: `https://${process.env.VERCEL_URL}/success.html`
        }, {
            timeout: 10000 // Beri waktu 10 detik
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error("DETIL ERROR:", error.response?.data || error.message);
        return res.status(500).json({ 
            error: 'Gagal ke Paykasir', 
            detil: error.response?.data?.message || error.message 
        });
    }
}
