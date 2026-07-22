# NZXT-ESC

### Zaawansowany edytor układów i personalizacji ekranu dla NZXT Kraken AIO

Twórz w pełni edytowalne układy LCD NZXT Kraken z nakładkami czujników przeciąganymi metodą „przeciągnij i upuść”, własnymi czcionkami, obrazami, GIF-ami, filmami MP4, zegarami, wykresami, danymi Now Playing i wizualizacjami reagującymi na dźwięk, wyświetlanymi na żywo przez **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Otwórz w NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Otwórz edytor WWW](https://nzxt-esc.pages.dev/)
· [Funkcje](#features)
· [Szybki start](#quick-start)
· [FAQ](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Edytor układów LCD NZXT Kraken typu przeciągnij i upuść w NZXT-ESC"
       width="70%" />

> [!NOTE]
> **NZXT-ESC jest niezależnym projektem społecznościowym.** Nie jest powiązany, sponsorowany ani oficjalnie wspierany przez NZXT.

Jeśli NZXT-ESC ulepszył Twoją konfigurację, możesz wesprzeć dalszy rozwój projektu:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## Personalizacja LCD NZXT Kraken bez stałych układów

NZXT-ESC zmienia ekran NZXT Kraken w swobodne płótno projektowe. Zbuduj własny ekran LCD, umieszczając każdy czujnik, grafikę, zegar, obraz lub element multimedialny dokładnie tam, gdzie chcesz. Zmieniaj rozmiar, obracaj, porządkuj, nazywaj, blokuj i stylizuj elementy, obserwując aktualizację wyniku na żywo przez NZXT CAM.

Główny edytor **nie wymaga konta** ani **oddzielnej instalacji po stronie użytkownika**. Presety i lokalne multimedia pozostają w pamięci przeglądarki. Opcjonalne nakładki muzyczne korzystają z lokalnej aplikacji towarzyszącej dla Windows [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="quick-start"></a>
## Szybki start

### Otwórz bezpośrednio w NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Kliknij **Open NZXT-ESC in NZXT CAM**.
2. Zezwól przeglądarce na otwarcie NZXT CAM.
3. Potwierdź **Load Web Integration**.
4. Otwórz nową kartę Web Integration i wybierz **Configure**.
5. Utwórz układ; zmiany będą synchronizowane z ekranem Kraken.

<details>
<summary><strong>Ręczna konfiguracja w NZXT CAM</strong></summary>

1. Otwórz **NZXT CAM**.
2. Przejdź do **Lighting → Kraken → LCD Display**.
3. Wybierz **Web Integration**.
4. Otwórz ustawienia **Custom Web Integration**.
5. Wpisz:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Wybierz **Apply**, a następnie **Add as Card**.
7. Otwórz nową kartę i wybierz **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Ekran konfiguracji NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Dodawanie NZXT-ESC jako karty NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Zobacz w działaniu

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Niestandardowy preset LCD NZXT Kraken utworzony w NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Animowany układ ekranu NZXT Kraken w NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Nakładka czujników NZXT CAM na żywo na LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Niestandardowy animowany ekran LCD Kraken działający przez NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Funkcje

| Możliwość | Co zyskujesz |
|---|---|
| **Swobodny edytor układów** | Przeciągaj, skaluj, obracaj, warstwuj, blokuj, zmieniaj nazwy i precyzyjnie ustawiaj każdy element. |
| **Dane czujników NZXT CAM na żywo** | Buduj własne ekrany CPU, GPU, RAM, temperatury cieczy, mocy, częstotliwości i prędkości wentylatorów. |
| **Zaawansowane grafiki** | Łącz w jednym układzie radialne, liniowe, kołowe i historyczne wykresy czujników. |
| **Animowane tła** | Używaj kolorów, gradientów, lokalnych obrazów, GIF-ów, filmów MP4, bezpośrednich adresów multimediów, YouTube i Pinterest. |
| **Integracja Now Playing** | Wyświetlaj okładki albumów, informacje o utworach i wizualizacje reagujące na dźwięk z lokalnego klienta Windows. |
| **Explore i Library** | Importuj presety społeczności, edytuj każdy element, porządkuj ulubione i zarządzaj własną lokalną kolekcją. |
| **Lokalne przechowywanie danych** | Presety używają LocalStorage, lokalne multimedia IndexedDB, a dane pozostają na urządzeniu. |
| **Wielojęzyczny edytor** | Korzystaj z interfejsu w 18 obsługiwanych językach. |

### Elementy nakładki

Aktualny edytor grupuje elementy nakładki w czterech przejrzystych kategoriach:

| Treść | Dane | Czas | Dźwięk |
|---|---|---|---|
| Tekst | Czujnik | Zegar cyfrowy | Okładka albumu |
| Kształt | Grafika radialna | Zegar analogowy | Tekst Now Playing |
| Ikona | Grafika liniowa | Data | Wizualizator dźwięku |
| Naklejka | Grafika kołowa |  |  |
| Obraz | Wykres czujnika |  |  |

W miarę możliwości wszystkie elementy korzystają z tego samego wizualnego sposobu pracy: wybierz element w podglądzie lub na liście warstw, a następnie zmień jego pozycję, rozmiar, obrót, kolejność, styl i ustawienia właściwe dla danego typu.

### Monitorowanie sprzętu

Twórz układy na żywo z danych monitoringu dostępnych w NZXT CAM, takich jak:

`temperatura CPU` · `obciążenie CPU` · `częstotliwość CPU` · `moc CPU` · `prędkość wentylatora CPU` · `temperatura GPU` · `obciążenie GPU` · `częstotliwość GPU` · `moc GPU` · `prędkość wentylatora GPU` · `użycie RAM` · `temperatura cieczy`

Systemy z wieloma GPU mogą automatycznie wybrać aktywną kartę lub użyć wskazanej GPU. Gdy API NZXT CAM jest niedostępne, edytor w przeglądarce wyświetla dane przykładowe, dzięki czemu nadal można projektować i podglądać układy.

### Tła i multimedia

Użyj jednolitego koloru lub gradientu jako podstawy, a następnie dodaj multimedia z:

- Lokalnych plików PNG, JPG, GIF, WebP lub MP4
- Bezpośrednich adresów URL obrazów i filmów
- Filmów YouTube
- Łączy multimedialnych Pinterest

Multimedia tła można pozycjonować, skalować, dopasowywać i łączyć z dowolnym układem nakładek. Lokalne pliki są przechowywane w IndexedDB i nie są przesyłane przez NZXT-ESC.

### Presety, Explore i Library

- Zapisuj i organizuj do **20 własnych presetów** w lokalnej Library.
- Buduj każdy preset z maksymalnie **40 elementów nakładki**.
- Importuj i eksportuj edytowalne pliki presetów do kopii zapasowych lub udostępniania.
- Przeglądaj układy społeczności w **Explore**.
- Dodaj preset z Explore do Library, dostosuj go i stwórz własną wersję.
- Utrzymuj synchronizację edycji i renderowania Kraken między dwoma widokami NZXT CAM.

## Now Playing i wizualizator dźwięku

Opcjonalny klient Windows [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) działa lokalnie i wysyła dane sesji multimedialnej oraz widma audio do NZXT-ESC przez lokalne połączenie WebSocket.

Możesz dodać:

- **Okładkę albumu** bieżącą grafikę z regulacją rozmiaru, obramowania i narożników
- **Tekst Now Playing** tytuł, wykonawcę lub album z przewijaniem długiego tekstu
- **Wizualizator dźwięku** konfigurowalne widmo i przebieg fali w czasie rzeczywistym

Rozwiązanie nie jest ograniczone do Spotify. Aplikacja towarzysząca odczytuje obsługiwane sesje multimedialne Windows oraz wyjście dźwięku systemowego z przeglądarek, odtwarzaczy i innych aplikacji.

<a id="languages"></a>
## Języki

Edytor obsługuje obecnie:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**Przetłumaczona dokumentacja:**
[English](../README.md) ·
[Türkçe](README.tr.md) ·
[Español](README.es.md) ·
[Deutsch](README.de.md) ·
[Português-BR](README.pt-BR.md) ·
[Français](README.fr.md) ·
[Italiano](README.it.md) ·
[日本語](README.ja.md) ·
[ไทย](README.th.md) ·
[Polski](README.pl.md) ·
[Svenska](README.sv.md) ·
[Nederlands](README.nl.md) ·
[한국어](README.ko.md) ·
[Русский](README.ru.md) ·
[हिन्दी](README.hi.md) ·
[Bahasa Indonesia](README.id.md) ·
[Čeština](README.cs.md) ·
[Filipino](README.fil.md)

## Prywatność i lokalne przechowywanie

NZXT-ESC został zaprojektowany z myślą o lokalnym przechowywaniu danych w przeglądarce:

- Konfiguracja presetów jest przechowywana w **LocalStorage**.
- Lokalne obrazy i filmy są przechowywane w **IndexedDB**.
- Odczyty czujników NZXT CAM i presety utworzone przez użytkownika nie są wysyłane do analityki.
- Aplikacja nie zbiera celowo danych umożliwiających identyfikację użytkownika.

Wersja produkcyjna strony używa **Google Tag Manager** i **Google Analytics 4** do anonimowej analizy produktu. **CookieYes** zarządza zgodą tam, gdzie jest ona wymagana, a opcjonalne pliki cookie analityczne są włączane zgodnie z wyborem użytkownika. Wersje deweloperskie nie wymagają usług analitycznych środowiska produkcyjnego.

## Rozwój

### Uruchom lokalnie

```bash
npm install
npm run dev
```

Otwórz `http://localhost:5173`. Gdy NZXT CAM jest niedostępny, edytor używa przykładowych danych sprzętowych.

```bash
npm run build   # Sprawdź typy i utwórz build produkcyjny
npm test        # Uruchom kontrole i18n i zestaw testów Vitest
```

### Architektura

<details>
<summary><strong>Struktura projektu i zasady projektowe</strong></summary>

```text
src/
├─ core/       Kontrakty domenowe presetów, nakładek, elementów i teł
├─ render/     Wspólny silnik preset-do-modelu-renderowania
├─ storage/    Stan LocalStorage, import/eksport i multimedia IndexedDB
├─ platform/   Adaptery NZXT CAM i lokalnej aplikacji towarzyszącej
├─ sync/       Synchronizacja edytora i środowiska wykonawczego
├─ i18n/       Typowane komunikaty językowe i narzędzia tłumaczeń
└─ ui/
   ├─ config/  Edytor konfiguracji typu przeciągnij i upuść
   ├─ kraken/  Lekki runtime ekranu Kraken
   └─ shared/  Wielokrotnego użytku komponenty interfejsu
```

Podgląd edytora i środowisko wykonawcze Kraken korzystają z tej samej kanonicznej ścieżki renderowania. Wspólny silnik utrzymuje zgodność układu, stylu i transformacji między projektem użytkownika a tym, co pojawia się na fizycznym ekranie.

Dane presetów są normalizowane przed zapisem, import i eksport mają wersjonowanie, a aktualizacje edytora są synchronizowane przez `BroadcastChannel` z mechanizmem zapasowym `localStorage`.

</details>

### Współtworzenie

Wkład społeczności i skupione pull requesty są mile widziane. Przed zmianami architektury przeczytaj:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Kodeks postępowania](../CODE_OF_CONDUCT.md)
- [Polityka bezpieczeństwa](../SECURITY.md)

<a id="faq"></a>
## FAQ

<details>
<summary><strong>Czy muszę instalować NZXT-ESC?</strong></summary>

Główny edytor nie wymaga osobnej instalacji. Otwórz go przez NZXT CAM Web Integration. Tylko opcjonalne nakładki muzyczne wymagają lokalnego klienta Windows NowPlaying.WebSocket.

</details>

<details>
<summary><strong>Czy NZXT-ESC działa bez NZXT CAM?</strong></summary>

Edytor można otworzyć w zwykłej przeglądarce i używać przykładowych wartości czujników do projektowania. Monitorowanie sprzętu na żywo i wyświetlanie na ekranie Kraken wymagają NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Które modele NZXT Kraken są obsługiwane?</strong></summary>

NZXT-ESC jest przeznaczony dla urządzeń NZXT Kraken obsługujących tryb wyświetlania NZXT CAM Web Integration. Dostępny rozmiar i kształt ekranu są ustalane przez API NZXT CAM.

</details>

<details>
<summary><strong>Gdzie są przechowywane presety i lokalne multimedia?</strong></summary>

Presety są przechowywane w LocalStorage przeglądarki, a lokalne obrazy i filmy w IndexedDB. Regularnie eksportuj ważne presety przy zmianie przeglądarki, instalacji Windows lub komputera.

</details>

<details>
<summary><strong>Czy Now Playing wymaga Spotify?</strong></summary>

Nie. NowPlaying.WebSocket korzysta z obsługiwanych sesji multimedialnych Windows i dźwięku systemowego, dlatego może działać z przeglądarkami i innymi zgodnymi aplikacjami multimedialnymi.

</details>

<details>
<summary><strong>Czy można edytować presety społeczności?</strong></summary>

Tak. Presety zaimportowane z Explore są w pełni edytowalne po dodaniu do Library.

</details>

<a id="license"></a>
## Licencja

NZXT-ESC jest udostępniany na **Licencji do użytku osobistego**.

**Dozwolone:** użytek osobisty, własne modyfikacje i redystrybucja z wyraźnym wskazaniem oryginalnego projektu.

**Użycie komercyjne:** sprzedaż, dołączanie do pakietów, wynajem, integracja z płatnym produktem lub inne użycie zarobkowe wymagają wcześniejszej pisemnej zgody właściciela projektu.
Pełne warunki znajdują się w [LICENSE](../LICENSE).

## Wsparcie i linki

- **Strona internetowa:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **Najnowsze wydanie:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Błędy i pomysły:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **Aplikacja towarzysząca:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

Jeśli NZXT-ESC ulepszył Twoją konfigurację, możesz wesprzeć dalszy rozwój projektu:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Stworzone przez **Gökhan AKGÜL (mRGogo)** napędzane kawą i wątpliwym harmonogramem snu.
