export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const data = req.body;

    // Logika verifikasi status dari Paykasir
    // Biasanya statusnya 'PAID' atau 'SUCCESS'
    if (data.status === 'PAID') {
        console.log(`Pesanan ${data.merchant_order_id} TELAH LUNAS!`);
        
        // TODO: Tambahkan kode di sini untuk:
        // 1. Kirim email ke pembeli
        // 2. Update status di database (jika ada)
    }

    // Wajib kirim response balik ke Paykasir agar mereka berhenti kirim notifikasi
    res.status(200).send('OK');
}
