# Yazı tipi lisansları

Bu klasördeki `.woff2` dosyaları üçüncü taraflara ait yazı tipleridir.
Aşağıdaki koşullar geçerlidir.

| Yazı tipi | Sahibi | Lisans | Kaynak |
|---|---|---|---|
| Clash Display | Indian Type Foundry | ITF Free Font License (FFL) v2.0 | https://www.fontshare.com/fonts/clash-display |
| Satoshi | Indian Type Foundry | ITF Free Font License (FFL) v2.0 | https://www.fontshare.com/fonts/satoshi |
| JetBrains Mono | JetBrains | SIL Open Font License 1.1 | https://github.com/JetBrains/JetBrainsMono |

Lisans metinleri:

- **ITF FFL v2.0** → https://www.fontshare.com/licenses/itf-ffl
  (metin ITF'nin mülkiyetinde olduğu için buraya kopyalanmadı, bağlantıdan okunur)
- **SIL OFL 1.1** → bu klasördeki [`OFL.txt`](OFL.txt)
  (OFL, yazı tipiyle birlikte dağıtılmasını **zorunlu tutar**; dosya o yüzden burada)

## Clash Display & Satoshi — ITF FFL özeti

Lisansın bu projeyi ilgilendiren maddeleri (17 Ağustos 2026 tarihli v2.0 metninden):

**İzin verilenler**

- Kişisel ve ticari kullanım, ücretsiz ve süresiz.
- **Kendi sunucunda barındırma (self-hosting) açıkça serbest** ve lisans metninde
  "daha iyi kontrol, güvenilirlik ve performans için önerilir" deniyor. `@font-face`
  ile kullanım bu kapsamda. Fontshare API'sini kullanmak zorunlu değil.
- Web, mobil, baskı, video, sosyal medya — her mecrada, her ölçekte.
- Atıf (kredi) verme zorunluluğu **yok**.

**Yasak olanlar**

- Dosyaları başkasına dağıtmak: e-posta, indirme servisi, font kütüphanesi,
  **herkese açık sunucu veya repository** üzerinden erişilebilir kılmak dahil.
- Fontları değiştirmek: **subsetting (karakter alt kümesi çıkarma), format
  dönüştürme**, glif düzenleme, isim/telif bilgisi değiştirme.
- Fontları üçüncü kişilerin kendi içeriklerini üretmesi için bir araçta
  (şablon editörü, SaaS, tasarım aracı) seçilebilir font olarak sunmak.

> Bu klasördeki Fontshare dosyaları, Fontshare'in dağıttığı `.woff2` biçiminin
> **birebir kopyasıdır** — üzerinde subsetting veya format dönüşümü yapılmadı.

## ⚠ Yayınlarken dikkat

Lisans, fontları *kendi siteni sunmak için* barındırmana izin verirken, aynı
dosyaları **herkese açık bir repository üzerinden erişilebilir kılmayı yasaklıyor.**
Yani:

| Yayın yöntemi | Durum |
|---|---|
| `npx vercel --prod` (yerelden yükleme) | ✅ Sorun yok — dosyalar repoya girmiyor |
| Netlify Drop (klasörü sürükle-bırak) | ✅ Sorun yok |
| **Public** GitHub reposu + Pages | ⚠ Font dosyaları repodan indirilebilir olur — lisansa aykırı |
| **Private** GitHub reposu | ✅ Sorun yok |

Public bir repo kullanmak zorundaysan iki çözüm var:

1. `.woff2` dosyalarını `.gitignore`'a ekle ve dağıtımı yerelden yap
   (repo yalnızca kaynak kodu tutar), **veya**
2. `assets/fonts/fonts.css` yerine Fontshare CDN'ine dön — API üzerinden sunum
   lisansta açıkça serbest. `index.html`'deki font bloğunu şununla değiştir:

```html
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" />
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" />
```

JetBrains Mono (OFL) için böyle bir kısıt yok; onu public repoda tutabilirsin,
tek şart `OFL.txt` dosyasının yanında bulunması — ki duruyor.
