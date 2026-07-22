# NZXT-ESC

### Editor avanzato di layout e personalizzazione dello schermo per NZXT Kraken AIO

Crea layout LCD NZXT Kraken completamente modificabili con overlay dei sensori trascinabili, font personalizzati, immagini, GIF, video MP4, orologi, grafici, dati Now Playing e visualizzazioni reattive al suono, renderizzati in tempo reale tramite **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Apri in NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Apri l’editor web](https://nzxt-esc.pages.dev/)
· [Funzionalità](#features)
· [Avvio rapido](#quick-start)
· [FAQ](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Editor drag-and-drop di layout LCD NZXT Kraken di NZXT-ESC"
       width="70%" />

> [!NOTE]
> **NZXT-ESC è un progetto indipendente della community.** Non è affiliato, sponsorizzato o approvato da NZXT.

## Personalizzazione del display LCD NZXT Kraken senza layout fissi

NZXT-ESC trasforma il display NZXT Kraken in una tela a forma libera. Crea una schermata LCD personalizzata posizionando ogni sensore, grafico, orologio, immagine o elemento multimediale esattamente dove desideri. Ridimensiona, ruota, riordina, rinomina, blocca e personalizza gli elementi mentre osservi il risultato aggiornarsi in tempo reale tramite NZXT CAM.

L’editor principale **non richiede un account** né **un’installazione separata per l’utente finale**. Preset e contenuti multimediali locali rimangono nello spazio di archiviazione del browser. Gli overlay musicali opzionali utilizzano l’applicazione Windows locale [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="quick-start"></a>
## Avvio rapido

### Apri direttamente in NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Fai clic su **Open NZXT-ESC in NZXT CAM**.
2. Consenti al browser di aprire NZXT CAM.
3. Conferma **Load Web Integration**.
4. Apri la nuova scheda Web Integration e seleziona **Configure**.
5. Crea il tuo layout; le modifiche vengono sincronizzate con il display Kraken.

<details>
<summary><strong>Configurazione manuale in NZXT CAM</strong></summary>

1. Apri **NZXT CAM**.
2. Vai a **Lighting → Kraken → LCD Display**.
3. Seleziona **Web Integration**.
4. Apri le impostazioni di **Custom Web Integration**.
5. Inserisci:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Seleziona **Apply**, quindi **Add as Card**.
7. Apri la nuova scheda e seleziona **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Schermata di configurazione NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Aggiungere NZXT-ESC come scheda NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Guardalo in azione

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Preset LCD NZXT Kraken personalizzato creato con NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Layout animato del display NZXT Kraken in NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Overlay dei sensori NZXT CAM in tempo reale su un LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Schermata LCD Kraken animata e personalizzata tramite NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Funzionalità

| Funzione | Cosa ti offre |
|---|---|
| **Editor di layout a forma libera** | Trascina, ridimensiona, ruota, sovrapponi, blocca, rinomina e posiziona con precisione ogni elemento. |
| **Dati dei sensori NZXT CAM in tempo reale** | Crea schermate personalizzate per CPU, GPU, RAM, temperatura del liquido, potenza, frequenza e velocità delle ventole. |
| **Grafica avanzata** | Combina grafici radiali, lineari, circolari e storici dei sensori in un unico layout. |
| **Sfondi animati** | Usa colori, gradienti, immagini locali, GIF, video MP4, URL multimediali diretti, YouTube e Pinterest. |
| **Integrazione Now Playing** | Mostra copertine degli album, informazioni sui brani e visualizzazioni reattive al suono da un client Windows locale. |
| **Explore e Library** | Importa preset della community, modifica ogni dettaglio, organizza i preferiti e gestisci la tua raccolta locale. |
| **Archiviazione locale come priorità** | I preset usano LocalStorage; i contenuti locali usano IndexedDB e restano sul dispositivo. |
| **Editor multilingue** | Usa l’interfaccia in 18 lingue supportate. |

### Elementi overlay

L’editor attuale raggruppa gli elementi overlay in quattro categorie chiare:

| Contenuto | Dati | Tempo | Audio |
|---|---|---|---|
| Testo | Sensore | Orologio digitale | Copertina album |
| Forma | Grafico radiale | Orologio analogico | Testo Now Playing |
| Icona | Grafico lineare | Data | Visualizzatore audio |
| Adesivo | Grafico circolare |  |  |
| Immagine | Grafico sensore |  |  |

Quando possibile, tutti gli elementi seguono lo stesso flusso visivo: seleziona l’elemento nell’anteprima o nell’elenco dei livelli, quindi regola posizione, dimensione, rotazione, ordine, stile e impostazioni specifiche.

### Monitoraggio hardware

Crea layout in tempo reale usando i dati di monitoraggio disponibili in NZXT CAM, tra cui:

`temperatura CPU` · `carico CPU` · `frequenza CPU` · `potenza CPU` · `velocità ventola CPU` · `temperatura GPU` · `carico GPU` · `frequenza GPU` · `potenza GPU` · `velocità ventola GPU` · `utilizzo RAM` · `temperatura liquido`

I sistemi con più GPU possono selezionare automaticamente la GPU attiva o usare una GPU specifica. L’editor nel browser fornisce anche valori simulati quando l’API NZXT CAM non è disponibile, così i layout possono comunque essere progettati e visualizzati in anteprima.

### Sfondi e contenuti multimediali

Usa un colore pieno o un gradiente come base, quindi aggiungi contenuti da:

- File locali PNG, JPG, GIF, WebP o MP4
- URL diretti di immagini e video
- Video YouTube
- Collegamenti multimediali Pinterest

I contenuti di sfondo possono essere posizionati, ridimensionati, adattati e combinati con qualsiasi layout overlay. I file locali sono salvati in IndexedDB e non vengono caricati da NZXT-ESC.

### Preset, Explore e Library

- Salva e organizza fino a **20 preset personalizzati** nella Library locale.
- Crea ogni preset con un massimo di **40 elementi overlay**.
- Importa ed esporta file preset modificabili per backup o condivisione.
- Sfoglia i layout creati dalla community tramite **Explore**.
- Aggiungi un preset di Explore alla Library, personalizzalo e rendilo tuo.
- Mantieni sincronizzati modifica e rendering Kraken tra le due viste di NZXT CAM.

## Now Playing e visualizzatore audio

Il client Windows opzionale [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) viene eseguito localmente e invia a NZXT-ESC i dati della sessione multimediale e dello spettro audio tramite una connessione WebSocket locale.

Usalo per aggiungere:

- **Copertina album** immagine corrente con controlli di dimensione, bordo e angoli
- **Testo Now Playing** titolo, artista o album con scorrimento per i testi lunghi
- **Visualizzatore audio** spettro e forme d’onda personalizzabili in tempo reale

Non è limitato a Spotify. L’app complementare legge le sessioni multimediali Windows supportate e l’uscita audio di sistema da browser, lettori multimediali e altre applicazioni.

<a id="languages"></a>
## Lingue

Attualmente l’editor supporta:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**Documentazione tradotta:**
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

## Privacy e archiviazione locale

NZXT-ESC è progettato attorno all’archiviazione locale del browser:

- La configurazione dei preset è salvata in **LocalStorage**.
- Immagini e video locali sono salvati in **IndexedDB**.
- Le letture dei sensori NZXT CAM e i preset creati dagli utenti non vengono inviati ai servizi di analisi.
- L’app non raccoglie intenzionalmente informazioni personali identificabili.

Il sito di produzione usa **Google Tag Manager** e **Google Analytics 4** per analisi anonime del prodotto. **CookieYes** gestisce il consenso dove richiesto e i cookie di analisi opzionali vengono attivati in base alle scelte dell’utente. Le build di sviluppo non richiedono i servizi di analisi di produzione.

## Sviluppo

### Esecuzione locale

```bash
npm install
npm run dev
```

Apri `http://localhost:5173`. L’editor usa dati hardware simulati quando NZXT CAM non è disponibile.

```bash
npm run build   # Controlla i tipi e crea una build di produzione
npm test        # Esegui i controlli i18n e la suite Vitest
```

### Architettura

<details>
<summary><strong>Struttura del progetto e principi di progettazione</strong></summary>

```text
src/
├─ core/       Contratti di dominio per preset, overlay, elementi e sfondi
├─ render/     Motore condiviso da preset a modello di rendering
├─ storage/    Stato LocalStorage, import/export e contenuti IndexedDB
├─ platform/   Adattatori per NZXT CAM e app complementare locale
├─ sync/       Sincronizzazione editor/runtime
├─ i18n/       Messaggi locali tipizzati e utilità di traduzione
└─ ui/
   ├─ config/  Editor di configurazione drag-and-drop
   ├─ kraken/  Runtime leggero per il display Kraken
   └─ shared/  Componenti di interfaccia riutilizzabili
```

L’anteprima dell’editor e il runtime Kraken usano la stessa pipeline di rendering canonica. Questo motore condiviso mantiene coerenti layout, stile e trasformazioni tra ciò che l’utente progetta e ciò che appare sul display fisico.

I dati dei preset vengono normalizzati prima dell’archiviazione, importazione ed esportazione sono versionate e gli aggiornamenti dell’editor vengono sincronizzati tramite `BroadcastChannel`, con `localStorage` come fallback.

</details>

### Contribuire

Contributi e pull request mirate sono benvenuti. Prima di apportare modifiche architetturali, leggi:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Codice di condotta](../CODE_OF_CONDUCT.md)
- [Politica di sicurezza](../SECURITY.md)

<a id="faq"></a>
## FAQ

<details>
<summary><strong>Devo installare NZXT-ESC?</strong></summary>

L’editor principale non richiede un’installazione separata. Aprilo tramite NZXT CAM Web Integration. Solo gli overlay musicali opzionali richiedono il client Windows locale NowPlaying.WebSocket.

</details>

<details>
<summary><strong>NZXT-ESC funziona senza NZXT CAM?</strong></summary>

L’editor può essere aperto in un normale browser e usa valori simulati dei sensori per la progettazione. Il monitoraggio hardware in tempo reale e l’output sul display Kraken richiedono NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Quali modelli NZXT Kraken sono supportati?</strong></summary>

NZXT-ESC è progettato per i dispositivi NZXT Kraken che supportano la modalità display NZXT CAM Web Integration. Le dimensioni e la forma disponibili vengono determinate tramite l’API NZXT CAM.

</details>

<details>
<summary><strong>Dove vengono salvati preset e contenuti locali?</strong></summary>

I preset sono salvati nel LocalStorage del browser. Immagini e video locali sono salvati in IndexedDB. Esporta regolarmente i preset importanti quando cambi browser, installazione Windows o computer.

</details>

<details>
<summary><strong>Now Playing richiede Spotify?</strong></summary>

No. NowPlaying.WebSocket usa le sessioni multimediali Windows supportate e l’audio di sistema, quindi può funzionare con browser e altre applicazioni multimediali compatibili.

</details>

<details>
<summary><strong>I preset della community possono essere modificati?</strong></summary>

Sì. I preset importati da Explore sono completamente modificabili dopo essere stati aggiunti alla Library.

</details>

<a id="license"></a>
## Licenza

NZXT-ESC è distribuito con una **Licenza per uso personale**.

**Consentito:** uso personale, modifiche personali e ridistribuzione con chiara attribuzione al progetto originale.

**Uso commerciale:** vendita, distribuzione in bundle, noleggio, integrazione in un prodotto a pagamento o qualsiasi altro uso monetizzato richiedono l’autorizzazione scritta preventiva del proprietario del progetto.
Consulta [LICENSE per i termini completi](../LICENSE).

## Supporto e collegamenti

- **Sito web:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **Ultima versione:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Segnalazioni e idee:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **App complementare:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

<div align="center">

Se NZXT-ESC ha migliorato la tua configurazione, puoi sostenere lo sviluppo continuo:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Creato da **Gökhan AKGÜL (mRGogo)** — alimentato da caffè e discutibili orari di sonno.

</div>
