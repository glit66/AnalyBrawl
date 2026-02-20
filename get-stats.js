export default async function handler(req, res) {
    // Tarayıcıdan gelen oyuncu tagını alıyoruz
    const { tag } = req.query;

    // Vercel Panelinden ekleyeceğin gizli değişken
    const token = process.env.BRAWL_TOKEN;

    if (!tag) {
        return res.status(400).json({ error: "Lütfen bir oyuncu tagı gönderin! ⚠️" });
    }

    // Brawl Stars API URL'i (Tag başındaki # işaretini URL uyumlu hale getiriyoruz)
    const apiUrl = `https://api.brawlstars.com/v1/players/%23${tag.replace('#', '')}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.status === 403) {
            return res.status(403).json({ error: "API Erişim Reddedildi! (IP Sorunu olabilir) 🚫" });
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: "Oyuncu bulunamadı veya API hatası! ❌" });
        }

        const data = await response.json();

        // Veriyi tarayıcıya (index.html'e) gönderiyoruz
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Sunucu tarafında bir hata oluştu: " + error.message });
    }
}