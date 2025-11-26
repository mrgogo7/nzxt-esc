> ⚠️ This document is an automatically translated version of the main English README.
> Technical terms, code blocks, filenames, and project terminology are intentionally kept in their original form.

# NZXT Elite Screen Customizer (NZXT-ESC) v5.11.261

Un editor moderno di media e overlay basato su browser per schermi LCD NZXT Kraken Elite.

Crea sfondi animati personalizzati, overlay di metriche, livelli di testo, linee divisorie e layout completamente personalizzati — tutto sincronizzato in tempo reale all'interno di NZXT CAM.

Gratuito solo per uso personale — l'uso commerciale è rigorosamente vietato.

![License](https://img.shields.io/badge/License-Personal%20Use%20Only-red) ![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-purple) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Vite](https://img.shields.io/badge/Vite-Bundler-purple) ![GitHub release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc)

<p align="center">
  <img src="https://raw.githubusercontent.com/mrgogo7/nzxt-esc/refs/heads/main/docs/Demo-Preview1.png" width="400"/>
  <img src="https://raw.githubusercontent.com/mrgogo7/nzxt-esc/refs/heads/main/docs/Demo-Preview2.png" width="400"/>
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif" width="400"/>
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif" width="400"/>
</p>

---
## 📋 CONTENUTI

- [🚀 Avvio Rapido](#-avvio-rapido)
  - [Metodo 1 — Avvio Diretto (Consigliato)](#metodo-1--avvio-diretto-consigliato)
  - [Metodo 2 — Installazione Manuale (Dentro NZXT CAM)](#metodo-2--installazione-manuale-dentro-nzxt-cam)
  - [Consigliato: Rinominare la Scheda di Integrazione](#consigliato-rinominare-la-scheda-di-integrazione)
- [🎛 Utilizzo dell'Editor (Pulsante Configura)](#-utilizzo-delleditor-pulsante-configura)
- [💡 Cosa Rende NZXT-ESC Speciale?](#-cosa-rende-nzxt-esc-speciale)
  - [1. Esperienza di Modifica Orientata al Design](#1-esperienza-di-modifica-orientata-al-design)
  - [2. Motore Overlay Completo Basato su Elementi](#2-motore-overlay-completo-basato-su-elementi)
  - [3. Sincronizzazione LCD in Tempo Reale](#3-sincronizzazione-lcd-in-tempo-reale)
  - [4. Motore Media Avanzato](#4-motore-media-avanzato)
  - [5. Sistema Preset (Accesso Anticipato)](#5-sistema-preset-accesso-anticipato)
- [🌍 Lingue Supportate](#-lingue-supportate)
- [🧪 Dettagli Tecnici](#-dettagli-tecnici)
- [🔧 Informazioni per Sviluppatori](#-informazioni-per-sviluppatori)
- [🕛 Cronologia Versioni](#-cronologia-versioni)
- [🔗 Link](#-link)
- [📜 Licenza](#-licenza)

---
### 🚀 AVVIO RAPIDO

NZXT-ESC funziona DENTRO NZXT CAM utilizzando la funzionalità "Web Integration". Ci sono due modi per installarlo:

#### METODO 1 — AVVIO DIRETTO (CONSIGLIATO)

1. Copia questo nella barra degli indirizzi del tuo browser:
   ```text
   nzxt-cam://action/load-web-integration?url=https://mrgogo7.github.io/nzxt-esc/
   ```
2. Premi Invio.
3. Il tuo browser mostrerà una domanda: "Aprire il link nzxt-cam con NZXT CAM?" → Approva / Consenti
4. NZXT CAM verrà avviato automaticamente.
5. Vedrai una finestra di conferma: Caricare Web Integration? Sei sicuro di voler caricare la seguente integrazione web?
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
6. Premi "Carica".
7. Dopo il caricamento, apri la scheda "Custom Web Integration".

#### METODO 2 — INSTALLAZIONE MANUALE (DENTRO NZXT CAM)

1. Apri NZXT CAM.
2. Vai a: Lighting → Kraken Elite V2 → LCD Display
3. Cambia la modalità di visualizzazione in: Web Integration
4. Trova la scheda chiamata: Custom Web Integration
5. Clicca su "Settings".
6. Inserisci l'URL:
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
7. Premi "Apply".
8. Quindi premi: Add as Card
9. Apparirà una nuova scheda Web Integration chiamata "My Web Integration".
10. Seleziona "My Web Integration".
11. Premi "Configure" per aprire l'editor NZXT-ESC.

#### CONSIGLIATO: RINOMINARE LA SCHEDA DI INTEGRAZIONE

NZXT CAM assegna il nome predefinito "My Web Integration". Per rinominare:
1. Seleziona "My Web Integration".
2. Premi "Edit".
3. Cambia i campi in: Title:
   ```text
   Elite Screen Customizer
   ```
   Description:
   ```text
   NZXT Elite Screen Customizer (NZXT-ESC)
   ```
Questo aiuta a distinguere l'integrazione dalle altre.

---
### 🎛 UTILIZZO DELL'EDITOR (PULSANTE CONFIGURA)

Tutta la modifica viene eseguita DENTRO NZXT CAM tramite il pulsante "Configure".

Nell'editor puoi:

- Aggiungere / rimuovere elementi di metriche, testo e divisori (fino a 20 elementi per overlay)
- Regolare posizione, rotazione, scala, opacità e colore
- Scegliere media di sfondo MP4 / GIF / PNG / JPG
- Utilizzare file Local Media memorizzati nel browser tramite IndexedDB
- Gestire preset (Import, Export, Duplicate, Delete, Rename, Apply)
- Utilizzare modelli di overlay preset (layout Single, Dual, Triple, Quadruple InfoGraphic)
- Importare overlay preset con opzioni Replace o Append
- Passare rapidamente tra preset preferiti tramite il menu a discesa Quick Favorites
- Anteprimere tutte le modifiche in tempo reale sul tuo Kraken Elite LCD

Non è più necessaria URL esterna o config.html.

---
### 💡 COSA RENDE NZXT-ESC SPECIALE?

NZXT-ESC non è un pacchetto di temi — è un **editor di layout completo orientato al design** costruito specificamente per il Kraken Elite LCD.

Offre libertà creativa completa ben oltre ciò che NZXT CAM supporta nativamente.

NZXT CAM **non consente**:
- Posizionamento libero degli elementi  
- Scala o rotazione degli elementi  
- Overlay di testo personalizzati  
- Colori trasparenti  
- Sfondi MP4  
- Sfondi YouTube  
- URL Pinterest  
- Combinazioni di media misti + overlay  

NZXT-ESC **abilita tutto questo**.

#### 1. ESPERIENZA DI MODIFICA ORIENTATA AL DESIGN

- Posizionamento libero drag-and-drop
- Rotazione e scala per elemento
- Maniglie di trasformazione attorno all'anteprima LCD circolare
- Micro regolazioni con i tasti freccia
- Interfaccia minimalista e senza distrazioni
- Anteprima circolare accurata che corrisponde all'hardware reale

#### 2. MOTORE OVERLAY COMPLETO BASATO SU ELEMENTI

Le modalità Legacy Single/Dual/Triple sono state completamente rimosse.

Ora puoi aggiungere liberamente:

- Elementi di metriche
- Elementi di testo
- Elementi divisori

Ogni elemento supporta:

- Posizione X/Y
- Rotazione
- Scala
- Colore e opacità
- Evidenziazione della selezione

**Sistema Overlay Preset**

Applica rapidamente layout preconfigurati utilizzando il modal di selezione modelli. Scegli tra modelli Single, Dual, Triple o Quadruple InfoGraphic, ciascuno con posizionamento e stile ottimizzati. I modelli possono essere importati con modalità Replace (sovrascrive elementi esistenti) o Append (aggiunge agli elementi esistenti). Durante l'aggiunta, i valori zIndex vengono normalizzati automaticamente per evitare conflitti di rendering. Il sistema supporta fino a 20 elementi overlay per configurazione.

#### 3. SINCRONIZZAZIONE LCD IN TEMPO REALE

- Aggiornamenti con throttle di ~100ms per stabilità
- Nessun aggiornamento manuale necessario
- Lo schermo LCD si aggiorna istantaneamente mentre modifichi

#### 4. MOTORE MEDIA AVANZATO

Il motore media supporta:

- Video MP4 (riproduzione completa nel LCD)
- Animazioni GIF
- Immagini PNG / JPG
- File Local Media (IndexedDB): Immagini e video a piena risoluzione caricati direttamente dal tuo computer
- **URL Pinterest → risolti automaticamente a media diretti**
- **URL YouTube (riproduzione LCD)**


##### **🆕 Supporto Local Media (NUOVO)**

NZXT-ESC ora include un sistema integrato per caricare **immagini o video locali** direttamente nell'editor.  
I file sono memorizzati in modo sicuro in **IndexedDB** e non lasciano mai il tuo dispositivo.

Tipi di file supportati:
- JPG / PNG / GIF  
- Video MP4  
- Dimensione massima: **150 MB**

Caratteristiche principali:
- Utilizzo completamente offline — nessun hosting esterno richiesto  
- Funziona con rotazione, scala, fit/align e tutti gli strumenti di trasformazione  
- Sincronizzazione LCD in tempo reale identica ai media remoti  
- Ogni preset può contenere un riferimento a media locali  
- I media locali **non sono inclusi** all'interno dei file preset esportati  
- Durante l'importazione, i preset che utilizzavano media locali mostreranno un avviso e permetteranno la ri-selezione

Questo sistema consente sfondi veramente offline e rispettosi della privacy rimanendo 100% compatibile con il motore di trasformazione dell'editor.


**Punti Salienti dell'Integrazione YouTube:**

- I video YouTube **si riproducono sull'LCD reale** (autoplay/mute/loop supportati)
- L'Anteprima dell'editor non può riprodurre video YouTube a causa delle restrizioni del player incorporato  
- Invece, viene mostrato un **placeholder rosso trascinabile**  
- Gli utenti possono:
  - Posizionare il video YouTube  
  - Scalare il video  
  - Applicare impostazioni align/fit  
  - Posizionare qualsiasi elemento overlay sopra  
- L'LCD riflette sempre il risultato finale in tempo reale  
- Tutti gli strumenti di sfondo standard funzionano perfettamente con YouTube

Modalità di adattamento:

- **Cover** — riempie l'intero display  
- **Contain** — mantiene il rapporto d'aspetto completo  
- **Fill** — allunga per adattarsi (opzionale)  

Questo rende NZXT-ESC il primo editor LCD completamente compatibile con YouTube per NZXT CAM.

#### 5. SISTEMA PRESET (ACCESSO ANTICIPATO)

Azioni disponibili:

- Import
- Export
- Delete
- Duplicate
- Rename
- Apply

I preset memorizzano il layout completo come JSON.

**Import/Export Overlay Preset**

Esporta le tue configurazioni di elementi overlay come file `.nzxt-esc-overlay-preset` per backup o condivisione. Importa overlay preset con validazione e gestione degli errori. Durante l'importazione, scegli la modalità Replace per sovrascrivere elementi esistenti o la modalità Append per aggiungere nuovi elementi preservando quelli attuali. Il sistema di importazione include generazione automatica di ID per elementi modello e normalizzazione zIndex per contenuti aggiunti.

**Menu a Discesa Quick Favorites**

Passando il mouse sul pulsante Preset Manager, viene rivelato un menu a discesa compatto che elenca fino a 10 preset preferiti (marcati con ★). Ogni voce mostra il nome del preset, lo stato preferito e un indicatore "attivo" per il preset attualmente applicato. Selezionando un elemento, quel preset viene applicato immediatamente utilizzando la stessa logica di merge atomico e autosave del manager completo. Il menu a discesa presenta animazioni fluide fade-in/fade-out e include un link diretto per aprire l'interfaccia completa del Preset Manager. Questo fornisce un flusso di lavoro estremamente veloce per utenti che passano frequentemente tra un piccolo insieme di preset preferiti.

##### **Local Media & Presets**
- I file preset esportati **non includono** il binario dei media locali  
- L'importazione di un preset che utilizzava precedentemente media locali mostra un avviso guidato  
- Gli utenti possono ri-selezionare il file tramite il nuovo modal **Browse**  
- Tutte le funzioni preset esistenti (Apply, Duplicate, Rename, Delete) supportano completamente i riferimenti ai media locali  
- Il passaggio tra preset carica automaticamente i media locali appropriati da IndexedDB (se disponibili)

---
### 🌍 LINGUE SUPPORTATE

NZXT-ESC supporta più lingue per un'esperienza utente localizzata. Passa tra le lingue utilizzando il selettore di lingua nell'intestazione dell'editor.

| Language | Code | File |
|----------|------|------|
| 🇬🇧 English | `en` | [i18n.ts](./src/i18n.ts) |
| 🇹🇷 Turkish | `tr` | [i18n.ts](./src/i18n.ts) |
| 🇪🇸 Spanish | `es` | [i18n.ts](./src/i18n.ts) |
| 🇩🇪 German | `de` | [i18n.ts](./src/i18n.ts) |
| 🇧🇷 Portuguese (BR) | `pt-BR` | [i18n.ts](./src/i18n.ts) |
| 🇫🇷 French | `fr` | [i18n.ts](./src/i18n.ts) |
| 🇮🇹 Italian | `it` | [i18n.ts](./src/i18n.ts) |
| 🇯🇵 Japanese | `ja` | [i18n.ts](./src/i18n.ts) |

Tutte le traduzioni sono mantenute in un singolo file TypeScript per una facile gestione e aggiornamenti.

---
### 🧪 DETTAGLI TECNICI

- React 18
- TypeScript
- Vite bundler
- Sincronizzazione LocalStorage + trasmissione eventi
- Motore di rendering consapevole del LCD circolare
- Matematica di trasformazione AABB + rotazione
- Sistema overlay preset con generazione elementi basata su modelli
- Assegnazione automatica ID e normalizzazione zIndex
- Supporto UI multilingue (English, Turkish, Spanish, German, Portuguese, French, Italian, Japanese)

---
### 🔧 INFORMAZIONI PER SVILUPPATORI

Clonare e Installare:

```bash
git clone https://github.com/mrgogo7/nzxt-esc
cd nzxt-esc
npm install
```

Avviare il Server di Sviluppo:

```bash
npm run dev
```

Esporre su LAN per test NZXT CAM:

```bash
npm run dev -- --host
```

Compilare:

```bash
npm run build
```

Anteprima compilazione:

```bash
npm run preview
```

**Contributing:**

- Apri una Issue prima di iniziare modifiche importanti
- Mantieni i PR piccoli e focalizzati
- Usa messaggi di commit chiari
- Segui la struttura del progetto

---
### 🕛 CRONOLOGIA VERSIONI

#### 5.11.261 — Supporto Local Media + Miglioramenti Editor (NUOVO)

**Data di Rilascio:** 2025-11-26

##### 🆕 NUOVE FUNZIONALITÀ
- **Sfondi Local Media (IndexedDB)**
  - Importa JPG, PNG, GIF o MP4 direttamente dal tuo computer  
  - File memorizzati in modo sicuro tramite IndexedDB  
  - Funziona offline  
  - Compatibile con tutte le modalità di trasformazione fit/scale/align  
  - Completamente sincronizzato con il Kraken LCD in tempo reale  
  - Il campo URL mostra `Local: filename.ext` in formato multilingue  

##### 💡 Miglioramenti Sistema Preset
- L'esportazione di preset contenenti media locali attiva un avviso (media non inclusi)  
- L'importazione di tali preset mostra un messaggio di ri-selezione  
- Il passaggio tra preset carica automaticamente i media locali se disponibili  

##### 🖥 MIGLIORAMENTI UI
- Nuovo modal Browse per selezionare media locali  
  - Supporto multilingue completo per tutti i messaggi di media locali  
- Nuova icona pulsante + stile aggiornato  

##### 🧩 MIGLIORAMENTI STABILITÀ
- Pipeline di risoluzione media migliorata  
- Revoca Blob + pulizia per prevenire perdite  
- Migliore gestione errori e copertura i18n  

#### 5.11.26 — Rinnovamento Sincronizzazione LCD Kraken in Tempo Reale e Miglioramenti Stabilità Overlay

**Nota Aggiuntiva:**  
- **Supporto sfondo YouTube** (riproduzione LCD) introdotto con allineamento completo posizionamento/scala utilizzando il nuovo sistema Anteprima basato su placeholder.  
- Matematica di trasformazione unificata assicura allineamento proporzionale Anteprima ↔ LCD.

#### 5.11.241 — Rinnovamento Sincronizzazione LCD Kraken in Tempo Reale e Miglioramenti Stabilità Overlay

**Data di Rilascio:** 2025-11-24

##### 🔧 Miglioramenti Importanti del Sistema

- **Rinnovamento Sincronizzazione LCD Kraken in Tempo Reale**  
  La sincronizzazione LCD in tempo reale non è stata introdotta di recente, ma l'intero sistema interno è stato ricostruito. L'implementazione precedente si basava su cicli di ricaricamento preset e causava ritardi, aggiornamenti mancati e comportamenti di ritorno. La nuova architettura di sincronizzazione tra schede basata su BroadcastChannel fornisce un flusso di aggiornamento stabile, a bassa latenza e sincronizzato con i fotogrammi.

##### 🛠 Miglioramenti

- **Miglioramenti affidabilità rendering overlay**  
  Quando lo stato overlay runtime è vuoto, il sistema ora ritorna in modo sicuro ai dati overlay preset memorizzati.

- **Aggiornamento stabilità sfondo/media**  
  Ritorno trasformazione rimosso su cambiamenti input.

- **Ottimizzazione visualizzatore KrakenOverlay**  
  Non ricarica più i preset; ora ascolta direttamente i cambiamenti runtime per aggiornamenti istantanei.

##### 🐞 Correzioni Bug

- Aggiornamenti LCD ritardati corretti (precedentemente aggiornati solo dopo la fine del trascinamento).

- Overlay mancanti nella vista Kraken dopo aggiornamento corretti.

- Avvisi chiave React duplicati durante l'aggiunta di overlay preset corretti.

- Impostazioni media/sfondo che tornavano indietro durante le regolazioni corrette.

##### ⚙ Cambiamenti Architettura

- Modulo dedicato `runtimeBroadcast.ts` introdotto per comunicazione tra schede.

- `setElementsForPresetSilent()` aggiunto per aggiornamenti runtime sicuri senza loop di trasmissione.

- `useOverlayConfig()` aggiornato per gestire correttamente krakenMode + fallback storage.

- Tutte le fonti di aggiornamento overlay unificate in un singolo pipeline guidato da runtime.

##### 📁 Note per Sviluppatori

- BroadcastChannel ritorna elegantemente se non supportato.

- Gli aggiornamenti runtime vengono clonati in profondità prima della sincronizzazione per evitare problemi di mutazione.

- Questa versione sostituisce la vecchia architettura di sincronizzazione con un pipeline moderno, stabile e in tempo reale.

#### v5.11.24

- Pacchetto Miglioramento Qualità Overlay & Preset Manager
- Nuovo Modal Esportazione Overlay: Export ora richiede un nome file utilizzando un modal pulito (supporta tasto ENTER)
- Nuovo Pulsante Preset: Crea istantaneamente un preset vuoto completamente nuovo con valori predefiniti
- UI Preset Manager Migliorata: Pulsanti azione preset riordinati: Delete → Favorite → Duplicate → Rename → Apply
- Gestione Overlay Migliorata:
  - "Clear All Overlay Elements" ora utilizza un modal di conferma
  - Il tasto Delete rimuove l'elemento selezionato (con modal di conferma)
  - Supporto tooltip aggiunto per tutti i pulsanti di eliminazione
- Miglioramenti Usabilità Modal Globale: Tutti i modal ora supportano conferma tramite tasto ENTER
- Correzione Collisione ID per Append Overlay Preset: Problema chiave React duplicata completamente risolto rigenerando ID elementi in append
- Miglioramenti Stabilità Generale: Architettura runtime preservata, regole autosave rispettate e tutti i vincoli FAZ-9 rimangono intatti

#### v5.11.23

- Sistema overlay preset con modal selettore modelli
- Modelli Single, Dual, Triple e Quadruple InfoGraphic
- Import/export overlay preset con modalità Replace e Append
- Limite elementi aumentato a 20 per overlay
- Normalizzazione automatica zIndex per modelli aggiunti
- Generazione lista modelli dinamica da definizioni modelli
- Notifiche errore migliorate per operazioni import/export
- Miglioramenti posizionamento menu consapevole viewport

#### v5.11.21

- Motore layout basato su elementi
- Sistema trasformazione rotazione e scala
- Evidenziazione selezione
- Movimento con tasti freccia
- Modalità legacy rimosse
- Gestore preset completo (Import/Export/Duplicate/Delete/Rename/Apply)
- Menu a discesa Quick Favorites per cambio istantaneo preset
- Miglioramenti UX e stabilità

Vedi GitHub Releases per versioni precedenti.

---
### 🔗 LINK

Repository: https://github.com/mrgogo7/nzxt-esc/

Support: [GitHub Sponsors](https://github.com/sponsors/mrgogo7) • [Patreon](https://www.patreon.com/mRGogo7) • [Buy Me a Coffee](https://www.buymeacoffee.com/mrgogo)

Issues:

https://github.com/mrgogo7/nzxt-esc/issues

---
### 📜 LICENZA

Licenza Uso Personale

**Consentito:** Uso personale • Modifiche personali • Ridistribuzione con credito

**Non Consentito:** Uso commerciale • Vendita, bundling, noleggio o monetizzazione in qualsiasi forma

NZXT-ESC è un progetto hobby e guidato dalla comunità destinato solo all'uso personale.

<details>
<summary><strong>📁 Indice Completo Parole Chiave SEO (Clicca per Espandere)</strong></summary>

**nzxt kraken elite lcd editor, nzxt cam customization, nzxt web integration custom, nzxt animated lcd background, mp4 lcd background nzxt, youtube kraken elite lcd, nzxt gif overlay, nzxt overlay editor, custom lcd screen nzxt, nzxt cam alternatives, nzxt cam limitations, kraken elite custom display, nzxt lcd text editor, nzxt lcd metrics overlay, nzxt lcd mods, nzxt pinterest background, nzxt lcd media engine, nzxt-esc project, nzxt cam modding, nzxt kraken elite youtube support, custom nzxt layouts, nzxt cam web integration presets, nzxt overlay templates, nzxt custom ui editor, nzxt lcd graphics editor, nzxt real-time lcd sync, kraken elite advanced customization, nzxt cam mp4 support, nzxt cam gif support, nzxt cam youtube embed, nzxt cam background editor**

</details>

