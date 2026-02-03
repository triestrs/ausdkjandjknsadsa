export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ msg: 'Method Not Allowed' });

    const { input, type } = req.body;

    // --- KONFIGURASI ADMIN (Simpan di Vercel Env) ---
    const ADMIN_USER = process.env.ADMIN_USERNAME || "admin_ganteng";

    // 1. LOGIKA ADMIN
    if (type === 'admin_check' && input === ADMIN_USER) {
        return res.status(200).json({ status: 'success', role: 'admin' });
    }

    // 2. LOGIKA USER (KeyAuth & Pakasir)
    // Di sini kita asumsikan 'input' adalah License Key
    try {
        // Step A: (Opsional) Verifikasi ke KeyAuth.cc 
        // Untuk contoh ini, kita anggap kode valid jika panjangnya > 5
        if (input.length < 5) return res.status(400).json({ msg: 'Kode tidak valid!' });

        // Step B: Request QRIS ke Pakasir
        // Ganti URL dan API Key dengan data asli dari dashboard Pakasir
        const responsePakasir = await fetch("https://pakasir.com/api/create-transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: process.env.PAKASIR_API_KEY, // Set di Vercel
                amount: 50000, // Harga produk
                id_transaksi: `TRX-${Date.now()}`,
                metode: "QRIS"
            })
        });

        // Simulasi jika API Pakasir belum dipasang, kita beri QR Dummy
        // Jika sudah ada API asli, gunakan: const data = await responsePakasir.json();
        return res.status(200).json({
            status: 'success',
            role: 'user',
            qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PAKASIR-PAY-${input}`,
            amount: "Rp 50.000"
        });

    } catch (err) {
        return res.status(500).json({ msg: 'Server Error' });
    }
}
