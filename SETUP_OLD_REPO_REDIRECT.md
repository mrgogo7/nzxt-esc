# Eski Repository'de Redirect Kurulumu

Repository ismini değiştirdikten sonra, eski repository'de (`nzxt-web-integration-amc`) sadece redirect dosyaları bırakmanız gerekiyor.

## Adımlar

### 1. Eski Repository'yi Klonlayın (veya GitHub'da oluşturun)

Eğer eski repository hala mevcutsa, onu klonlayın:
```bash
git clone https://github.com/mrgogo7/nzxt-web-integration-amc.git old-repo
cd old-repo
```

### 2. Redirect Dosyalarını Kopyalayın

Bu repository'deki şu dosyaları eski repository'ye kopyalayın:

- `OLD_REPO_INDEX.html` → `index.html` olarak
- `OLD_REPO_404.html` → `404.html` olarak  
- `OLD_REPO_REDIRECT_README.md` → `README.md` olarak

### 3. Eski Repository'yi Temizleyin

Eski repository'deki tüm dosyaları silin (sadece redirect dosyaları kalacak):

```bash
# Tüm dosyaları sil (dikkatli olun!)
git rm -r *
git commit -m "Remove all files, keep only redirects"
```

### 4. Redirect Dosyalarını Ekleyin

```bash
# index.html olarak kopyala
cp OLD_REPO_INDEX.html index.html

# 404.html olarak kopyala  
cp OLD_REPO_404.html 404.html

# README.md olarak kopyala
cp OLD_REPO_REDIRECT_README.md README.md

git add index.html 404.html README.md
git commit -m "Add redirect pages for repository migration"
git push
```

### 5. GitHub Pages Ayarlarını Kontrol Edin

1. Eski repository'de **Settings** → **Pages** bölümüne gidin
2. **Source** olarak `main` branch'ini seçin
3. **Custom domain** yoksa, GitHub Pages URL'i: `https://mrgogo7.github.io/nzxt-web-integration-amc/`

## Sonuç

Artık eski URL'ye gidenler otomatik olarak yeni URL'ye yönlendirilecek:
- `https://mrgogo7.github.io/nzxt-web-integration-amc/` → `https://mrgogo7.github.io/nzxt-esc/`
- Tüm alt sayfalar da yönlendirilecek
- 404 hataları da yeni repository'ye yönlendirilecek

## Alternatif: GitHub Repository Redirect

GitHub otomatik olarak repository redirect sağlar, ancak GitHub Pages için manuel redirect dosyaları daha güvenilirdir.

