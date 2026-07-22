# NZXT-ESC

### NZXT Kraken AIO के लिए उन्नत स्क्रीन कस्टमाइज़ेशन लेआउट एडिटर

ड्रैग-एंड-ड्रॉप सेंसर ओवरले, कस्टम फ़ॉन्ट, चित्र, GIF, MP4 वीडियो, घड़ियाँ, ग्राफ़, Now Playing डेटा और ध्वनि पर प्रतिक्रिया देने वाले विज़ुअल के साथ पूरी तरह संपादन योग्य NZXT Kraken LCD लेआउट बनाएँ, जिन्हें **NZXT CAM Web Integration** के माध्यम से लाइव प्रदर्शित किया जाता है।

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[NZXT CAM में खोलें](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [वेब एडिटर खोलें](https://nzxt-esc.pages.dev/)
· [विशेषताएँ](#features)
· [त्वरित शुरुआत](#quick-start)
· [सामान्य प्रश्न](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESC ड्रैग-एंड-ड्रॉप NZXT Kraken LCD लेआउट एडिटर"
       width="70%" />

> [!NOTE]
> **NZXT-ESC एक स्वतंत्र सामुदायिक परियोजना है।** यह NZXT से संबद्ध, प्रायोजित या अनुमोदित नहीं है।

यदि NZXT-ESC ने आपके सेटअप को बेहतर बनाया है, तो आप इसके निरंतर विकास का समर्थन कर सकते हैं:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## निश्चित लेआउट के बिना NZXT Kraken LCD कस्टमाइज़ेशन

NZXT-ESC, NZXT Kraken डिस्प्ले को एक मुक्त डिज़ाइन कैनवास में बदल देता है। हर सेंसर, ग्राफ़िक, घड़ी, चित्र या मीडिया तत्व को ठीक अपनी पसंद की जगह रखकर कस्टम LCD स्क्रीन बनाएँ। तत्वों का आकार बदलें, घुमाएँ, क्रम बदलें, नाम बदलें, लॉक करें और स्टाइल करें, जबकि परिणाम NZXT CAM के माध्यम से लाइव अपडेट होता रहे।

मुख्य एडिटर के लिए **किसी खाते की आवश्यकता नहीं है** और **अंतिम उपयोगकर्ता को अलग से इंस्टॉल भी नहीं करना पड़ता**। प्रीसेट और स्थानीय मीडिया ब्राउज़र स्टोरेज में रहते हैं। वैकल्पिक संगीत ओवरले स्थानीय Windows सहायक ऐप [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) का उपयोग करते हैं।

<a id="quick-start"></a>
## त्वरित शुरुआत

### सीधे NZXT CAM में खोलें

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. **Open NZXT-ESC in NZXT CAM** पर क्लिक करें।
2. ब्राउज़र को NZXT CAM खोलने की अनुमति दें।
3. **Load Web Integration** की पुष्टि करें।
4. नया Web Integration कार्ड खोलें और **Configure** चुनें।
5. अपना लेआउट बनाएँ; परिवर्तन Kraken डिस्प्ले के साथ सिंक्रोनाइज़ हो जाएँगे।

<details>
<summary><strong>NZXT CAM के भीतर मैन्युअल सेटअप</strong></summary>

1. **NZXT CAM** खोलें।
2. **Lighting → Kraken → LCD Display** पर जाएँ।
3. **Web Integration** चुनें।
4. **Custom Web Integration** सेटिंग खोलें।
5. यह पता दर्ज करें:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. **Apply** चुनें और फिर **Add as Card** चुनें।
7. नया कार्ड खोलें और **Configure** चुनें।

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="NZXT CAM Web Integration सेटअप स्क्रीन"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="NZXT-ESC को NZXT CAM Web Integration कार्ड के रूप में जोड़ना"
       width="48%" />
</p>

</details>

## इसे काम करते हुए देखें

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="NZXT-ESC से बनाया गया कस्टम NZXT Kraken LCD प्रीसेट"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="NZXT-ESC में एनिमेटेड NZXT Kraken डिस्प्ले लेआउट"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Kraken LCD पर लाइव NZXT CAM सेंसर ओवरले"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="NZXT CAM के माध्यम से चलती कस्टम एनिमेटेड Kraken LCD स्क्रीन"
       width="48%" />
</p>

<a id="features"></a>
## विशेषताएँ

| क्षमता | आपको क्या मिलता है |
|---|---|
| **मुक्त लेआउट एडिटर** | हर तत्व को ड्रैग करें, आकार बदलें, घुमाएँ, परतों में रखें, लॉक करें, नाम बदलें और सटीक स्थान पर रखें। |
| **लाइव NZXT CAM सेंसर डेटा** | CPU, GPU, RAM, लिक्विड तापमान, पावर, फ़्रीक्वेंसी और पंखे की गति के लिए कस्टम डिस्प्ले बनाएँ। |
| **उन्नत ग्राफ़िक्स** | रेडियल, लीनियर, सर्कुलर और ऐतिहासिक सेंसर ग्राफ़ को एक ही लेआउट में जोड़ें। |
| **एनिमेटेड बैकग्राउंड** | रंग, ग्रेडिएंट, स्थानीय चित्र, GIF, MP4 वीडियो, सीधे मीडिया URL, YouTube और Pinterest स्रोत उपयोग करें। |
| **Now Playing एकीकरण** | स्थानीय Windows क्लाइंट से एल्बम आर्ट, ट्रैक जानकारी और ध्वनि-प्रतिक्रियाशील विज़ुअल दिखाएँ। |
| **Explore और Library** | समुदाय के प्रीसेट आयात करें, हर भाग संपादित करें, पसंदीदा व्यवस्थित करें और अपना स्थानीय संग्रह बनाए रखें। |
| **स्थानीय स्टोरेज प्राथमिकता** | प्रीसेट LocalStorage का और स्थानीय मीडिया IndexedDB का उपयोग करते हैं तथा आपके उपकरण पर रहते हैं। |
| **बहुभाषी एडिटर** | इंटरफ़ेस को 18 समर्थित भाषाओं में उपयोग करें। |

### ओवरले तत्व

वर्तमान एडिटर ओवरले तत्वों को चार स्पष्ट श्रेणियों में बाँटता है:

| सामग्री | डेटा | समय | ऑडियो |
|---|---|---|---|
| पाठ | सेंसर | डिजिटल घड़ी | एल्बम कवर |
| आकार | रेडियल ग्राफ़िक | एनालॉग घड़ी | Now Playing पाठ |
| आइकन | लीनियर ग्राफ़िक | दिनांक | ऑडियो विज़ुअलाइज़र |
| स्टिकर | सर्किल ग्राफ़िक |  |  |
| चित्र | सेंसर चार्ट |  |  |

जहाँ संभव हो, सभी तत्व एक ही दृश्य कार्यप्रवाह का उपयोग करते हैं: प्रीव्यू या लेयर सूची से तत्व चुनें, फिर उसकी स्थिति, आकार, घुमाव, क्रम, शैली और प्रकार-विशिष्ट सेटिंग समायोजित करें।

### हार्डवेयर मॉनिटरिंग

NZXT CAM में उपलब्ध मॉनिटरिंग डेटा का उपयोग करके लाइव लेआउट बनाएँ, जिनमें शामिल हैं:

`CPU तापमान` · `CPU लोड` · `CPU फ़्रीक्वेंसी` · `CPU पावर` · `CPU पंखे की गति` · `GPU तापमान` · `GPU लोड` · `GPU फ़्रीक्वेंसी` · `GPU पावर` · `GPU पंखे की गति` · `RAM उपयोग` · `लिक्विड तापमान`

कई GPU वाले सिस्टम सक्रिय GPU को अपने आप चुन सकते हैं या किसी विशेष GPU का उपयोग कर सकते हैं। NZXT CAM API उपलब्ध न होने पर ब्राउज़र एडिटर नमूना मान भी देता है, इसलिए लेआउट का डिज़ाइन और प्रीव्यू जारी रखा जा सकता है।

### बैकग्राउंड और मीडिया

आधार के रूप में ठोस रंग या ग्रेडिएंट उपयोग करें, फिर यहाँ से मीडिया जोड़ें:

- स्थानीय PNG, JPG, GIF, WebP या MP4 फ़ाइलें
- चित्र और वीडियो के सीधे URL
- YouTube वीडियो
- Pinterest मीडिया लिंक

बैकग्राउंड मीडिया को स्थान दिया जा सकता है, स्केल किया जा सकता है, फ़िट किया जा सकता है और किसी भी ओवरले लेआउट के साथ जोड़ा जा सकता है। स्थानीय फ़ाइलें IndexedDB में संग्रहीत होती हैं और NZXT-ESC उन्हें अपलोड नहीं करता।

### प्रीसेट, Explore और Library

- स्थानीय Library में अधिकतम **20 कस्टम प्रीसेट** सहेजें और व्यवस्थित करें।
- हर प्रीसेट में अधिकतम **40 ओवरले तत्व** जोड़ें।
- बैकअप या साझा करने के लिए संपादन योग्य प्रीसेट फ़ाइलें आयात और निर्यात करें।
- **Explore** में समुदाय द्वारा बनाए गए लेआउट देखें।
- Explore प्रीसेट को Library में जोड़ें, कस्टमाइज़ करें और अपना बनाएँ।
- NZXT CAM के दोनों दृश्यों के बीच संपादन और Kraken रेंडरिंग को सिंक्रोनाइज़ रखें।

## Now Playing और ऑडियो विज़ुअलाइज़र

वैकल्पिक Windows क्लाइंट [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) स्थानीय रूप से चलता है और स्थानीय WebSocket कनेक्शन के माध्यम से मीडिया-सेशन तथा ऑडियो-स्पेक्ट्रम डेटा NZXT-ESC को भेजता है।

इसका उपयोग इन तत्वों को जोड़ने के लिए करें:

- **एल्बम कवर** आकार, बॉर्डर और कोने के नियंत्रण के साथ वर्तमान आर्टवर्क
- **Now Playing पाठ** लंबे पाठ के स्क्रॉल के साथ शीर्षक, कलाकार या एल्बम
- **ऑडियो विज़ुअलाइज़र** कस्टमाइज़ करने योग्य रीयल-टाइम स्पेक्ट्रम और वेवफ़ॉर्म विज़ुअल

यह केवल Spotify तक सीमित नहीं है। सहायक ऐप ब्राउज़र, मीडिया प्लेयर और अन्य ऐप से समर्थित Windows मीडिया सेशन और सिस्टम ऑडियो आउटपुट पढ़ता है।

<a id="languages"></a>
## भाषाएँ

एडिटर वर्तमान में इन भाषाओं का समर्थन करता है:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**अनुवादित दस्तावेज़:**
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

## गोपनीयता और स्थानीय स्टोरेज

NZXT-ESC को ब्राउज़र के स्थानीय स्टोरेज को ध्यान में रखकर बनाया गया है:

- प्रीसेट कॉन्फ़िगरेशन **LocalStorage** में संग्रहीत होता है।
- स्थानीय चित्र और वीडियो **IndexedDB** में संग्रहीत होते हैं।
- NZXT CAM सेंसर रीडिंग और उपयोगकर्ता द्वारा बनाए गए प्रीसेट एनालिटिक्स को नहीं भेजे जाते।
- ऐप जानबूझकर व्यक्तिगत पहचान योग्य जानकारी एकत्र नहीं करता।

प्रोडक्शन वेबसाइट गुमनाम उत्पाद विश्लेषण के लिए **Google Tag Manager** और **Google Analytics 4** का उपयोग करती है। जहाँ आवश्यक हो, **CookieYes** सहमति का प्रबंधन करता है और वैकल्पिक एनालिटिक्स कुकी उपयोगकर्ता की पसंद के अनुसार सक्षम होती हैं। विकास बिल्ड को प्रोडक्शन एनालिटिक्स सेवाओं की आवश्यकता नहीं होती।

## विकास

### स्थानीय रूप से चलाएँ

```bash
npm install
npm run dev
```

`http://localhost:5173` खोलें। NZXT CAM उपलब्ध न होने पर एडिटर नमूना हार्डवेयर डेटा उपयोग करता है।

```bash
npm run build   # टाइप जाँचें और प्रोडक्शन बिल्ड बनाएँ
npm test        # i18n जाँच और Vitest टेस्ट सूट चलाएँ
```

### आर्किटेक्चर

<details>
<summary><strong>परियोजना संरचना और डिज़ाइन सिद्धांत</strong></summary>

```text
src/
├─ core/       प्रीसेट, ओवरले, तत्व और बैकग्राउंड डोमेन अनुबंध
├─ render/     साझा प्रीसेट-से-रेंडर-मॉडल इंजन
├─ storage/    LocalStorage स्थिति, आयात/निर्यात और IndexedDB मीडिया
├─ platform/   NZXT CAM और स्थानीय सहायक ऐप एडेप्टर
├─ sync/       एडिटर/रनटाइम सिंक्रोनाइज़ेशन
├─ i18n/       टाइप-सुरक्षित भाषा संदेश और अनुवाद उपयोगिताएँ
└─ ui/
   ├─ config/  ड्रैग-एंड-ड्रॉप कॉन्फ़िगरेशन एडिटर
   ├─ kraken/  हल्का Kraken डिस्प्ले रनटाइम
   └─ shared/  पुनः उपयोग योग्य इंटरफ़ेस घटक
```

एडिटर प्रीव्यू और Kraken रनटाइम एक ही मानक रेंडर पाइपलाइन उपयोग करते हैं। यह साझा इंजन उपयोगकर्ता के डिज़ाइन और भौतिक डिस्प्ले पर दिखाई देने वाले परिणाम के बीच लेआउट, शैली और ट्रांसफ़ॉर्म व्यवहार को एक समान रखता है।

प्रीसेट डेटा को सहेजने से पहले सामान्यीकृत किया जाता है, आयात/निर्यात संस्करणित है और एडिटर अपडेट `BroadcastChannel` के माध्यम से सिंक्रोनाइज़ होते हैं, जिसमें `localStorage` बैकअप विकल्प है।

</details>

### योगदान

योगदान और स्पष्ट दायरे वाले pull request का स्वागत है। आर्किटेक्चर में बदलाव करने से पहले पढ़ें:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [आचार संहिता](../CODE_OF_CONDUCT.md)
- [सुरक्षा नीति](../SECURITY.md)

<a id="faq"></a>
## सामान्य प्रश्न

<details>
<summary><strong>क्या मुझे NZXT-ESC इंस्टॉल करना होगा?</strong></summary>

मुख्य एडिटर को अलग इंस्टॉलेशन की आवश्यकता नहीं है। इसे NZXT CAM Web Integration से खोलें। केवल वैकल्पिक संगीत ओवरले के लिए स्थानीय NowPlaying.WebSocket Windows क्लाइंट आवश्यक है।

</details>

<details>
<summary><strong>क्या NZXT-ESC, NZXT CAM के बिना काम करता है?</strong></summary>

एडिटर सामान्य ब्राउज़र में खोला जा सकता है और डिज़ाइन के लिए नमूना सेंसर मान उपयोग करता है। लाइव हार्डवेयर मॉनिटरिंग और Kraken डिस्प्ले पर आउटपुट के लिए NZXT CAM Web Integration आवश्यक है।

</details>

<details>
<summary><strong>कौन से NZXT Kraken मॉडल समर्थित हैं?</strong></summary>

NZXT-ESC उन NZXT Kraken उपकरणों के लिए बनाया गया है जो NZXT CAM Web Integration डिस्प्ले मोड का समर्थन करते हैं। उपलब्ध डिस्प्ले आकार और आकृति NZXT CAM API के माध्यम से निर्धारित होते हैं।

</details>

<details>
<summary><strong>प्रीसेट और स्थानीय मीडिया कहाँ संग्रहीत होते हैं?</strong></summary>

प्रीसेट ब्राउज़र के LocalStorage में और स्थानीय चित्र व वीडियो IndexedDB में संग्रहीत होते हैं। ब्राउज़र, Windows इंस्टॉलेशन या कंप्यूटर बदलते समय महत्वपूर्ण प्रीसेट नियमित रूप से निर्यात करें।

</details>

<details>
<summary><strong>क्या Now Playing के लिए Spotify आवश्यक है?</strong></summary>

नहीं। NowPlaying.WebSocket समर्थित Windows मीडिया सेशन और सिस्टम ऑडियो का उपयोग करता है, इसलिए यह ब्राउज़र और अन्य संगत मीडिया ऐप के साथ काम कर सकता है।

</details>

<details>
<summary><strong>क्या समुदाय के प्रीसेट संपादित किए जा सकते हैं?</strong></summary>

हाँ। Explore से आयात किए गए प्रीसेट Library में जोड़ने के बाद पूरी तरह संपादन योग्य होते हैं।

</details>

<a id="license"></a>
## लाइसेंस

NZXT-ESC को **व्यक्तिगत उपयोग लाइसेंस** के अंतर्गत जारी किया गया है।

**अनुमत:** व्यक्तिगत उपयोग, व्यक्तिगत संशोधन और मूल परियोजना को स्पष्ट श्रेय देते हुए पुनर्वितरण।

**व्यावसायिक उपयोग:** बेचना, बंडल करना, किराए पर देना, किसी सशुल्क उत्पाद में एकीकृत करना या अन्य आय उत्पन्न करने वाला उपयोग परियोजना स्वामी की पूर्व लिखित अनुमति के बिना अनुमत नहीं है।
पूरी शर्तों के लिए [LICENSE देखें](../LICENSE).

## सहायता और लिंक

- **वेबसाइट:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **नवीनतम रिलीज़:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **बग रिपोर्ट और विचार:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **सहायक ऐप:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

यदि NZXT-ESC ने आपके सेटअप को बेहतर बनाया है, तो आप इसके निरंतर विकास का समर्थन कर सकते हैं:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

**Gökhan AKGÜL (mRGogo)** द्वारा निर्मित — कॉफ़ी और संदिग्ध नींद के समय से संचालित।
