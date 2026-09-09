# Hamza Köybaşı — Portfolyo

Statik, bağımlılıksız kişisel portfolyo sitesi. Derleme (build) adımı yok:
`index.html` dosyasını açman yeterli.

```
portfolyo-hamzakoybasi/
├── index.html          # tüm içerik (Türkçe) + logo (inline SVG)
├── styles.css          # tasarım sistemi + tüm stiller
├── script.js           # dil, tema, filtre, modal, form, animasyonlar
└── assets/
    ├── logo.svg            # HK monogram (kare, açık zemin)
    ├── logo-wordmark.svg   # monogram + isim kilidi (yatay kullanım)
    ├── Hamza-Koybasi-CV.pdf
    └── projects/           # proje görselleri (opsiyonel)
```

## Logo

Monogram, **H ve K'nin ortak bir gövdeyi paylaşması** üzerine kurulu:
soldaki dikey çizgi + kiriş H'yi, ortadaki gövdeden çıkan iki kol K'yi tamamlıyor.
Bu iki kol aynı zamanda bir **`<`** işareti oluşturuyor — yazılım göndermesi.
H mürekkep siyahı (`--ink`), K'nin kolları kiremit turuncusu (`--accent`).
Site içinde **inline SVG** olarak durduğu için renklerini CSS değişkenlerinden alıyor:
`--accent` değerini değiştirdiğinde logo da onunla birlikte değişiyor.

Kullanım yerleri: header, footer, favicon (data URI), hero'daki soluk filigran ve
sayfa açılışındaki çizim animasyonu (preloader).

- **Dış kullanım** (GitHub, LinkedIn, kartvizit): `assets/logo.svg`
- **Yatay kilit** (imza, sunum kapağı): `assets/logo-wordmark.svg`
- **Boyut sınırı:** monogramı 24 px'in altında kullanma; kolların açısı kaybolur.
- **Renk:** tek renk gerekiyorsa tamamını beyaz ya da tamamını `#FF6B35` yap.

## Tipografi

Site tek bir açık (light) temada çalışır; koyu tema yoktur.

| Rol | Yazı tipi | Kaynak |
|---|---|---|
| Başlıklar (19px+) | **Clash Display** | Fontshare (Indian Type Foundry) |
| Gövde, arayüz, küçük kalın metin | **Satoshi** | Fontshare |
| Bölüm numarası, rozet, kod | **JetBrains Mono** | Google Fonts |

Kural: display yazı tipi **yalnızca 19px ve üstü başlıklarda** kullanılır; küçük kalın
metinler (madde başlıkları, okul adları) Satoshi ile dizilir — Clash Display o ölçekte
ağır durur.

**Fontlar yerel.** Hiçbir dış servise bağlanılmıyor: `.woff2` dosyaları
`assets/fonts/` içinde, `@font-face` tanımları `assets/fonts/fonts.css` dosyasında.
Toplam ~240 KB. Header'da en kritik iki dosya (`clash-display-600`, `satoshi-400`)
`rel="preload"` ile önden çekiliyor.

> **Yayınlamadan önce oku:** [`assets/fonts/LICENSE.md`](assets/fonts/LICENSE.md).
> Clash Display ve Satoshi'nin lisansı kendi siteni sunmak için barındırmaya izin
> veriyor ama **herkese açık bir GitHub reposunda** font dosyası bulundurmayı
> yasaklıyor. Vercel/Netlify'a yerelden yüklüyorsan sorun yok; public repo
> kullanacaksan dosyada anlatılan iki çözümden birini uygula.

İki teknik not:

- Fontshare API'si Clash Display isteğine **Satoshi bloklarını da ekliyor**.
  Dosyaları yeniden indireceksen `font-family` alanına göre filtrele, yoksa
  Satoshi dosyaları Clash'in üzerine yazılır (bu tuzağa bir kez düştüm).
- Clash Display'in boşluk karakteri dar. Başlıklardaki negatif harf aralığını
  `word-spacing` ile dengeledim; `letter-spacing` değerini değiştirirsen onu da ayarla.

## Teknoloji logoları

Hero altındaki kayan şeritte 13 marka ikonu var (React, Next.js, Node.js, Nest.js,
TypeScript, PostgreSQL, MongoDB, Supabase, Python, PHP, TailwindCSS, Solidity, Unity).
Kaynak: [Simple Icons](https://simpleicons.org) — CC0, atıf gerekmez.

SVG'ler sayfanın en üstünde bir **sprite** olarak bir kez tanımlanıp `<use>` ile
çağrılıyor; şerit döngü için iki kez tekrarlandığından bu, dosya boyutunu yarıya indiriyor.
Dışarıdan ikon isteği yapılmıyor.

- Varsayılan: gri (`--muted`), üzerine gelince **marka rengi** + şerit duruyor.
- Hep renkli isteniyorsa `styles.css` içinde `.mq:hover .mq-ico` seçicisini
  `.mq .mq-ico` yap — renkler her öğenin `style="--c:…"` değerinden geliyor.
- Yeni teknoloji eklemek için: `<symbol id="i-…">` sprite'a eklenir, sonra şeridin
  **iki kopyasına da** aynı `<span class="mq">` bloğu yazılır.

## Sayfa bölümleri

`01 Hakkımda` · `02 Hizmetler` · `03 Yetenekler` · `04 Projeler` · `05 Süreç` · `06 İletişim`
(eğitim bilgisi Hakkımda bölümündeki kartta.)

Öne çıkan davranışlar:

- **TR / EN dil değiştirici** — tercih `localStorage`'da saklanıyor
- **Proje filtreleri** ve her proje için **detay modalı** (özellikler, rol, teknolojiler)
- **İletişim formu** — sunucu gerektirmez, `mailto:` ile e-posta uygulamasını hazır açar
- Preloader'da logo çizim animasyonu, imleç efektleri, sayaçlar, Nevşehir saati
- `prefers-reduced-motion` açıksa tüm animasyonlar ve preloader devre dışı

## Yerelde çalıştırma

Dosyaya çift tıklamak yeterli. Tercihen küçük bir sunucu ile:

```bash
python3 -m http.server 5173
```

Sonra: http://localhost:5173

## Proje görselleri ekleme (önerilir)

Kartlarda şu an degrade + tarayıcı çerçevesi görünüyor. Gerçek ekran görüntüsü eklemek için:

1. Görseli `assets/projects/` içine aşağıdaki isimle kaydet.
2. `index.html` içinde o projenin `<button class="project-media …">` bloğundaki
   yorum satırını aç (`<!-- … -->` işaretlerini sil). Görsel bulunamazsa
   `onerror` sayesinde otomatik olarak degradeye düşer, sayfa bozulmaz.

| Dosya adı | Proje |
|---|---|
| `stepfiltre.jpg` | Step Filtre |
| `barkone.jpg` | Barkone |
| `ilac-ai.jpg` | İlaç Yan Etki Tahmin Sistemi |
| `ar-motor.jpg` | AR Motor Bilgilendirme Sistemi |
| `dapp.jpg` | Web3 Şehir Oylama Sistemi |
| `asracave.jpg` | Asra Cave Hotel |
| `urenglobal.jpg` | Üren Global |
| `mbseyda.jpg` | MB Seyda İnşaat |
| `hmz.jpg` | HMZ Solutions |

Önerilen boyut: 1600×900 px, 300 KB altı. WebP kullanacaksan `index.html` içindeki
`src` uzantısını da güncelle.

## Yayınlama

**Vercel (en hızlı)**
```bash
npx vercel --prod
```

**Netlify** — klasörü https://app.netlify.com/drop adresine sürükle-bırak.

**GitHub Pages**
```bash
git init && git add . && git commit -m "portfolyo"
git branch -M main
git remote add origin https://github.com/hamzakyb/portfolyo.git
git push -u origin main
```
Sonra repo → Settings → Pages → Branch: `main` / root.

Yayınladıktan sonra `index.html` içindeki `<link rel="canonical">` adresini kendi
alan adınla değiştir.

## İçeriği güncelleme

- **Metinler:** `index.html` içinde doğrudan Türkçe yazılı.
- **İngilizce karşılıkları:** `script.js` içindeki `EN` sözlüğü. Türkçe bir metni
  değiştirdiğinde, `data-i18n` anahtarına karşılık gelen İngilizcesini de güncelle.
- **Proje detay modalı:** `script.js` içindeki `PROJECTS` nesnesi (her proje için
  `tr` ve `en` bloğu, özellikler listesi ve linkler).
- **Yeni proje eklemek:** `index.html` içindeki bir `<article class="project" data-tags="…" data-id="…">`
  bloğunu kopyala; `data-tags` değerini filtreye göre ver
  (`web`, `ecommerce`, `ai`, `ar`, `web3`), medya sınıfını (`m1`…`m9`) ve
  `data-id`'yi değiştir, ardından `PROJECTS` içine aynı `data-id` ile detay ekle.
  Filtre butonlarındaki sayıları (`<i>9</i>`) güncellemeyi unutma.
- **Renk:** `styles.css` en üstteki `--accent` değişkeni. Logo dahil tüm site
  o tondan besleniyor.

## Not

CV PDF'inde bazı projelerin **admin panel kullanıcı adı ve şifreleri** yer alıyor.
Site üzerinde bu bilgiler bilinçli olarak yayınlanmadı. `assets/Hamza-Koybasi-CV.pdf`
herkese açık indirilebilir olduğu için, o PDF'ten de demo şifreleri çıkarman
(veya sadece demo hesabı bırakman) önerilir.
