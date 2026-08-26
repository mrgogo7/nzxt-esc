# NZXT-ESC - Καλύτερη Ενσωμάτωση Web NZXT

### Προηγμένος Επεξεργαστής Διάταξης Προσαρμογής Οθόνης για NZXT Kraken AIO

Δημιούργησε πλήρως επεξεργάσιμες διατάξεις LCD NZXT Kraken με overlay αισθητήρων μεταφοράς και απόθεσης, προσαρμοσμένες γραμματοσειρές, εικόνες, GIF, APNG, βίντεο MP4, WebM, ρολόγια, γραφήματα, δεδομένα Now Playing και οπτικά εφέ που αντιδρούν στον ήχο, τα οποία αποδίδονται ζωντανά μέσω του **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-25-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Άνοιγμα στο NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Άνοιγμα Ζωντανής Προεπισκόπησης](https://nzxt-esc.pages.dev/)
· [Υποστηριζόμενα Μοντέλα Kraken](#supported-nzxt-kraken-lcd-models)
· [Χαρακτηριστικά](#features)
· [Γρήγορη Εκκίνηση](#quick-start)
· [Συχνές Ερωτήσεις](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Επεξεργαστής διάταξης LCD NZXT Kraken με μεταφορά και απόθεση από το NZXT-ESC"
       width="70%" />

> [!NOTE]
> **Το NZXT-ESC είναι ένα ανεξάρτητο έργο κοινότητας.** Δεν σχετίζεται με, δεν χρηματοδοτείται από, και δεν υποστηρίζεται επίσημα από την NZXT.

Αν το NZXT-ESC βελτίωσε το setup σου, μπορείς να υποστηρίξεις τη συνέχιση της ανάπτυξής του:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## Προσαρμογή της οθόνης LCD NZXT Kraken χωρίς σταθερές διατάξεις

Το NZXT-ESC μετατρέπει την οθόνη NZXT Kraken σε έναν καμβά ελεύθερης μορφής. Δημιούργησε μια προσαρμοσμένη οθόνη LCD τοποθετώντας κάθε αισθητήρα, γραφικό, ρολόι, εικόνα ή στοιχείο μέσων ακριβώς εκεί που θέλεις. Άλλαξε μέγεθος, περιέστρεψε, αναδιάταξε, μετονόμασε, κλείδωσε και στυλιζάρισε στοιχεία ενώ βλέπεις το αποτέλεσμα να ενημερώνεται ζωντανά μέσω του NZXT CAM.

Ο βασικός επεξεργαστής δεν απαιτεί **λογαριασμό** ούτε **ξεχωριστή εγκατάσταση για τον τελικό χρήστη**. Τα preset και τα τοπικά μέσα παραμένουν στον αποθηκευτικό χώρο του browser. Τα προαιρετικά overlay μουσικής χρησιμοποιούν την τοπική εφαρμογή Windows [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="supported-nzxt-kraken-lcd-models"></a>

## Υποστηριζόμενα Μοντέλα LCD NZXT Kraken

Το NZXT-ESC υποστηρίζει υγρόψυκτα AIO NZXT Kraken με οθόνες LCD και NZXT CAM Web Integration, συμπεριλαμβανομένων των τρεχόντων και προηγούμενων γενεών μοντέλων Kraken Elite, Kraken Plus, Kraken και Kraken Z.

NZXT Kraken Elite (2024)
NZXT Kraken Elite 240
NZXT Kraken Elite 360
NZXT Kraken Elite 240 RGB
NZXT Kraken Elite 280 RGB
NZXT Kraken Elite 360 RGB
NZXT Kraken Elite 420 RGB
NZXT Kraken Plus (2025)
NZXT Kraken Plus 240
NZXT Kraken Plus 280
NZXT Kraken Plus 360
NZXT Kraken Plus 240 RGB
NZXT Kraken Plus 360 RGB
NZXT Kraken Elite (2023)
NZXT Kraken Elite 240 (2023)
NZXT Kraken Elite 280 (2023)
NZXT Kraken Elite 360 (2023)
NZXT Kraken Elite 240 RGB (2023)
NZXT Kraken Elite 280 RGB (2023)
NZXT Kraken Elite 360 RGB (2023)
NZXT Kraken (2023)
NZXT Kraken 240
NZXT Kraken 280
NZXT Kraken 360
NZXT Kraken 240 RGB
NZXT Kraken 280 RGB
NZXT Kraken 360 RGB
NZXT Kraken Z Series
NZXT Kraken Z53
NZXT Kraken Z63
NZXT Kraken Z73
NZXT Kraken Z53 RGB
NZXT Kraken Z63 RGB
NZXT Kraken Z73 RGB

Το NZXT-ESC προσαρμόζει αυτόματα τη διάταξη στην ανάλυση, το μέγεθος και το σχήμα οθόνης της LCD του Kraken, όπως αναφέρεται μέσω του API του NZXT CAM, επιτρέποντας προσαρμοσμένες διατάξεις, overlay αισθητήρων, κινούμενα φόντα, γραφικά και μέσα να αποδίδονται μέσω του NZXT CAM Web Integration.

<a id="quick-start"></a>
## Γρήγορη Εκκίνηση

### Άνοιγμα απευθείας στο NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Κάνε κλικ στο **Open NZXT-ESC in NZXT CAM**.
2. Επίτρεψε στον browser σου να ανοίξει το NZXT CAM.
3. Επιβεβαίωσε το **Load Web Integration**.
4. Άνοιξε τη νέα κάρτα Web Integration και επίλεξε **Configure**.
5. Δημιούργησε τη διάταξή σου. Οι αλλαγές συγχρονίζονται με την οθόνη του Kraken.

<details>
<summary><strong>Χειροκίνητη ρύθμιση μέσα στο NZXT CAM</strong></summary>

1. Άνοιξε το **NZXT CAM**.
2. Πήγαινε στο **Lighting → Kraken → LCD Display**.
3. Επίλεξε **Web Integration**.
4. Άνοιξε τις ρυθμίσεις **Custom Web Integration**.
5. Εισήγαγε:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Επίλεξε **Apply**, μετά **Add as Card**.
7. Άνοιξε τη νέα κάρτα και επίλεξε **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Οθόνη ρύθμισης NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Προσθήκη του NZXT-ESC ως κάρτα NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Δες το σε δράση

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Προσαρμοσμένο preset LCD NZXT Kraken δημιουργημένο με το NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Κινούμενη διάταξη οθόνης NZXT Kraken στο NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Ζωντανό overlay αισθητήρα NZXT CAM σε μια LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Προσαρμοσμένη κινούμενη οθόνη LCD Kraken που εκτελείται μέσω του NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Χαρακτηριστικά

| Δυνατότητα | Τι σου προσφέρει |
|---|---|
| **Επεξεργαστής διάταξης ελεύθερης μορφής** | Σύρε, άλλαξε μέγεθος, περιέστρεψε, τακτοποίησε σε επίπεδα, κλείδωσε, μετονόμασε και τοποθέτησε με ακρίβεια κάθε στοιχείο. |
| **Ζωντανά δεδομένα αισθητήρων NZXT CAM** | Δημιούργησε προσαρμοσμένες οθόνες για CPU, GPU, RAM, θερμοκρασία υγρού, ισχύ, συχνότητα και ταχύτητα ανεμιστήρα. |
| **Προηγμένα γραφικά** | Συνδύασε ακτινικά, γραμμικά, κυκλικά γραφικά και γραφικά ιστορικού αισθητήρα σε μία διάταξη. |
| **Κινούμενα φόντα** | Χρησιμοποίησε χρώματα, διαβαθμίσεις, τοπικές εικόνες, GIF, βίντεο MP4, άμεσα URL μέσων, YouTube και πηγές Pinterest. |
| **Ενσωμάτωση Now Playing** | Εμφάνισε εξώφυλλο άλμπουμ, πληροφορίες κομματιού και οπτικά εφέ που αντιδρούν στον ήχο από έναν τοπικό πελάτη Windows. |
| **Εξερεύνηση και Βιβλιοθήκη** | Εισήγαγε preset της κοινότητας, επεξεργάσου κάθε τμήμα, τακτοποίησε αγαπημένα και διατήρησε τη δική σου τοπική συλλογή preset. |
| **Αποθήκευση με προτεραιότητα στο τοπικό** | Τα preset χρησιμοποιούν LocalStorage. Τα τοπικά μέσα χρησιμοποιούν IndexedDB και παραμένουν στη συσκευή σου. |
| **Πολύγλωσσος επεξεργαστής** | Χρησιμοποίησε τη διεπαφή σε 25 υποστηριζόμενες γλώσσες. |

### Στοιχεία overlay

Ο τρέχων επεξεργαστής ομαδοποιεί τα στοιχεία overlay σε τέσσερις σαφείς κατηγορίες:

| Περιεχόμενο | Δεδομένα | Ώρα | Ήχος |
|---|---|---|---|
| Κείμενο | Αισθητήρας | Ψηφιακό Ρολόι | Εξώφυλλο Άλμπουμ |
| Σχήμα | Ακτινικό Γραφικό | Αναλογικό Ρολόι | Κείμενο Now Playing |
| Εικονίδιο | Γραμμικό Γραφικό | Ημερομηνία | Οπτικοποιητής Ήχου |
| Αυτοκόλλητο | Κυκλικό Γραφικό |  |  |
| Εικόνα | Γράφημα Αισθητήρα |  |  |

Κάθε στοιχείο χρησιμοποιεί την ίδια οπτική ροή εργασίας όπου είναι δυνατόν: επίλεξέ το στην προεπισκόπηση ή στη λίστα επιπέδων, και μετά προσάρμοσε τη θέση, το μέγεθος, την περιστροφή, τη σειρά, το στυλ και τις ειδικές ρυθμίσεις του τύπου του.

### Παρακολούθηση υλικού

Δημιούργησε ζωντανές διατάξεις χρησιμοποιώντας τα διαθέσιμα δεδομένα παρακολούθησης του NZXT CAM, όπως:

`θερμοκρασία CPU` · `φόρτος CPU` · `συχνότητα CPU` · `ισχύς CPU` · `ταχύτητα ανεμιστήρα CPU` · `θερμοκρασία GPU` · `φόρτος GPU` · `συχνότητα GPU` · `ισχύς GPU` · `ταχύτητα ανεμιστήρα GPU` · `χρήση RAM` · `θερμοκρασία υγρού`

Συστήματα με πολλαπλές GPU μπορούν να επιλέξουν αυτόματα την ενεργή GPU ή να χρησιμοποιήσουν συγκεκριμένη GPU. Ο επεξεργαστής στον browser παρέχει επίσης τιμές προσομοίωσης όταν το API του NZXT CAM δεν είναι διαθέσιμο, ώστε οι διατάξεις να μπορούν ακόμη να σχεδιαστούν και να προεπισκοπηθούν.

### Φόντα και μέσα

Χρησιμοποίησε ένα συμπαγές χρώμα ή διαβάθμιση ως βάση, και μετά πρόσθεσε μέσα από:

- Τοπικά αρχεία PNG, JPG, GIF, WebP ή MP4
- Άμεσα URL εικόνων και βίντεο
- Βίντεο YouTube
- Συνδέσμους μέσων Pinterest

Τα μέσα φόντου μπορούν να τοποθετηθούν, να κλιμακωθούν, να προσαρμοστούν και να συνδυαστούν με οποιαδήποτε διάταξη overlay. Τα τοπικά αρχεία αποθηκεύονται στο IndexedDB και δεν ανεβαίνουν πουθενά από το NZXT-ESC.

### Preset, Εξερεύνηση και Βιβλιοθήκη

- Αποθήκευσε και τακτοποίησε έως **20 προσαρμοσμένα preset** στην τοπική Βιβλιοθήκη.
- Δημιούργησε κάθε preset με έως **40 στοιχεία overlay**.
- Εισήγαγε και εξήγαγε επεξεργάσιμα αρχεία preset για δημιουργία αντιγράφων ασφαλείας ή διαμοιρασμό.
- Περιήγησε σε διατάξεις φτιαγμένες από την κοινότητα μέσω της **Εξερεύνησης**.
- Πρόσθεσε ένα preset από την Εξερεύνηση στη Βιβλιοθήκη, προσάρμοσέ το και κάν' το δικό σου.
- Διατήρησε την επεξεργασία και την απόδοση στο Kraken συγχρονισμένες ανάμεσα στις δύο προβολές του NZXT CAM.

## Now Playing και Οπτικοποιητής Ήχου

Ο προαιρετικός πελάτης Windows [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) εκτελείται τοπικά και στέλνει δεδομένα συνεδρίας μέσων και φάσματος ήχου στο NZXT-ESC μέσω μιας τοπικής σύνδεσης WebSocket.

Χρησιμοποίησέ τον για να προσθέσεις:

- **Εξώφυλλο Άλμπουμ** το τρέχον artwork με χειριστήρια μεγέθους, περιγράμματος και γωνιών
- **Κείμενο Now Playing** τίτλο, καλλιτέχνη ή άλμπουμ με κύλιση μεγάλου κειμένου
- **Οπτικοποιητής Ήχου** προσαρμόσιμα οπτικά φάσματος και κυματομορφής σε πραγματικό χρόνο

Δεν περιορίζεται στο Spotify. Η εφαρμογή συνοδείας διαβάζει τις υποστηριζόμενες συνεδρίες μέσων των Windows και την έξοδο ήχου του συστήματος από browser, media player και άλλες εφαρμογές.

<a id="languages"></a>
## Γλώσσες

Ο επεξεργαστής υποστηρίζει αυτή τη στιγμή:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino` · `العربية` · `Bahasa Melayu` · `Ελληνικά` · `繁體中文` · `Tiếng Việt` · `Українська` · `Magyar`

**Μεταφρασμένη τεκμηρίωση:**
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
[Filipino](README.fil.md) ·
[العربية](README.ar.md) ·
[Bahasa Melayu](README.ms.md) ·
[Ελληνικά](README.el.md) ·
[繁體中文](README.zh-TW.md) ·
[Tiếng Việt](README.vi.md) ·
[Українська](README.uk.md) ·
[Magyar](README.hu.md)

## Απόρρητο και τοπική αποθήκευση

Το NZXT-ESC είναι σχεδιασμένο γύρω από την τοπική αποθήκευση του browser:

- Η διαμόρφωση preset αποθηκεύεται στο **LocalStorage**.
- Οι τοπικές εικόνες και τα βίντεο αποθηκεύονται στο **IndexedDB**.
- Οι μετρήσεις αισθητήρων του NZXT CAM και τα preset που δημιουργεί ο χρήστης δεν αποστέλλονται σε analytics.
- Καμία προσωπικά αναγνωρίσιμη πληροφορία δεν συλλέγεται σκόπιμα από την εφαρμογή.

Ο ιστότοπος παραγωγής χρησιμοποιεί **Google Tag Manager** και **Google Analytics 4** για προαιρετικά ανώνυμα analytics προϊόντος. Το **CookieYes** διαχειρίζεται τη συγκατάθεση όπου απαιτείται, και τα cookies του Google Analytics ενεργοποιούνται σύμφωνα με τις επιλογές συγκατάθεσης του χρήστη.

Ο αναρτημένος ιστότοπος χρησιμοποιεί επίσης **Cloudflare Web Analytics**, ενεργοποιημένο μέσω του Cloudflare Pages και λειτουργεί ανεξάρτητα από το Google Tag Manager. Παρέχει analytics επισκεψιμότητας και απόδοσης ιστότοπου με προτεραιότητα στο απόρρητο, χωρίς χρήση cookies ή LocalStorage.

### Συνεισφορά

Οι συνεισφορές και τα στοχευμένα pull request είναι ευπρόσδεκτα. Πριν κάνεις αλλαγές στην αρχιτεκτονική, διάβασε:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Κώδικας Δεοντολογίας](../CODE_OF_CONDUCT.md)
- [Πολιτική Ασφαλείας](../SECURITY.md)

<a id="faq"></a>
## Συχνές Ερωτήσεις

<details>
<summary><strong>Χρειάζεται να εγκαταστήσω το NZXT-ESC;</strong></summary>

Ο βασικός επεξεργαστής δεν απαιτεί ξεχωριστή εγκατάσταση. Άνοιξέ τον μέσω του NZXT CAM Web Integration. Μόνο τα προαιρετικά overlay μουσικής απαιτούν τον τοπικό πελάτη Windows NowPlaying.WebSocket.

</details>

<details>
<summary><strong>Λειτουργεί το NZXT-ESC χωρίς το NZXT CAM;</strong></summary>

Ο επεξεργαστής μπορεί να ανοίξει σε έναν κανονικό browser και χρησιμοποιεί τιμές αισθητήρων προσομοίωσης για τον σχεδιασμό. Η ζωντανή παρακολούθηση υλικού και η έξοδος στην οθόνη του Kraken απαιτούν NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Ποια μοντέλα NZXT Kraken υποστηρίζονται;</strong></summary>

Το NZXT-ESC υποστηρίζει ψύκτρες με LCD **NZXT Kraken Elite, Kraken Plus, Kraken (2023) και σειρά Kraken Z** που παρέχουν τη λειτουργία οθόνης NZXT CAM Web Integration.

Δες την πλήρη λίστα [Υποστηριζόμενων Μοντέλων LCD NZXT Kraken](#supported-nzxt-kraken-lcd-models).

</details>

<details>
<summary><strong>Πού αποθηκεύονται τα preset και τα τοπικά μέσα;</strong></summary>

Τα preset αποθηκεύονται στο LocalStorage του browser. Οι τοπικές εικόνες και τα βίντεο αποθηκεύονται στο IndexedDB. Εξήγαγε τα σημαντικά preset τακτικά όταν μεταβαίνεις σε άλλον browser, εγκατάσταση Windows ή υπολογιστή.

</details>

<details>
<summary><strong>Το Now Playing απαιτεί Spotify;</strong></summary>

Όχι. Το NowPlaying.WebSocket χρησιμοποιεί υποστηριζόμενες συνεδρίες μέσων Windows και ήχο συστήματος, οπότε μπορεί να λειτουργήσει με browser και άλλες συμβατές εφαρμογές μέσων.

</details>

<details>
<summary><strong>Μπορούν να επεξεργαστούν τα preset της κοινότητας;</strong></summary>

Ναι. Τα preset που εισάγονται από την Εξερεύνηση είναι πλήρως επεξεργάσιμα αφού προστεθούν στη Βιβλιοθήκη.

</details>

<details>
<summary><strong>Πώς λειτουργεί η Πρόσβαση Υποστηρικτή;</strong></summary>

Το NZXT-ESC αναπτύσσεται και συντηρείται ανεξάρτητα. Αφού έχεις αρκετό χρόνο να δοκιμάσεις πραγματικά το έργο, το NZXT-ESC μπορεί να σε ρωτήσει αν θέλεις να υποστηρίξεις τη συνέχιση της ανάπτυξής του ή να πάρεις λίγο ακόμα χρόνο για να αποφασίσεις.

Η υποστήριξη δεν χρειάζεται να σημαίνει χρήματα. Σχόλια, αναφορές σφαλμάτων, ιδέες, διαμοιρασμός του έργου, βοήθεια σε άλλους να το ανακαλύψουν και άλλες ουσιαστικές συνεισφορές της κοινότητας βοηθούν όλα το NZXT-ESC να αναπτυχθεί.

Οι Κωδικοί Πρόσβασης Υποστηρικτή διατίθενται σε υποστηρικτές του έργου και μπορούν επίσης να χαριστούν σε μέλη της κοινότητας που συνεισφέρουν ουσιαστικά στο NZXT-ESC.

Ο χρόνος χρήσης μετριέται μόνο όσο το NZXT-ESC εκτελείται ενεργά στην οθόνη του Kraken.

</details>

<a id="license"></a>
## Άδεια Χρήσης

Το NZXT-ESC κυκλοφορεί υπό μια **Άδεια Προσωπικής Χρήσης**.

**Επιτρέπεται:** προσωπική χρήση, προσωπικές τροποποιήσεις και αναδιανομή με σαφή αναφορά στο αρχικό έργο.

**Εμπορική χρήση:** πώληση, ομαδοποίηση, ενοικίαση, ενσωμάτωση σε επί πληρωμή προϊόν ή άλλη χρήση με σκοπό το κέρδος απαιτεί προηγούμενη γραπτή άδεια από τον ιδιοκτήτη του έργου.
Δες [την πλήρη άδεια LICENSE](../LICENSE).

## Υποστήριξη και κοινότητα

- **Ιστότοπος:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **Τελευταία έκδοση:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Αναφορές σφαλμάτων και ιδέες:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

Ακολούθησε το NZXT-ESC στο YouTube και το Instagram για παρουσιάσεις, νέα χαρακτηριστικά, οδηγούς, setup της κοινότητας και ενημερώσεις του έργου.

Αν το NZXT-ESC έχει κερδίσει μια θέση στο setup σου, υπάρχουν πολλοί τρόποι να υποστηρίξεις το έργο: μοιράσου σχόλια και ιδέες, ανέφερε σφάλματα, βοήθησε άλλους να ανακαλύψουν το NZXT-ESC, συνεισφέρε στην κοινότητα, ή απλώς κέρασέ μου έναν καφέ.

Κάθε είδος συνεισφοράς βοηθά το NZXT-ESC να προχωρήσει, ενώ η υποστήριξη με καφέ βοηθά να καλυφθούν τα κόστη server, API, hosting και συντήρησης.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Φτιαγμένο από τον **Gökhan AKGÜL (mRGogo)** - λειτουργεί με καφέ και αμφίβολα ωράρια ύπνου.

</div>
