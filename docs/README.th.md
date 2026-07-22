# NZXT-ESC

### เครื่องมือแก้ไขเลย์เอาต์และปรับแต่งหน้าจอขั้นสูงสำหรับ NZXT Kraken AIO

สร้างเลย์เอาต์ LCD ของ NZXT Kraken ที่แก้ไขได้ทั้งหมดด้วยโอเวอร์เลย์เซนเซอร์แบบลากวาง ฟอนต์กำหนดเอง รูปภาพ GIF วิดีโอ MP4 นาฬิกา กราฟ ข้อมูล Now Playing และภาพตอบสนองต่อเสียง ซึ่งแสดงผลสดผ่าน **NZXT CAM Web Integration**

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[เปิดใน NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [เปิดเว็บเอดิเตอร์](https://nzxt-esc.pages.dev/)
· [คุณสมบัติ](#features)
· [เริ่มต้นใช้งาน](#quick-start)
· [คำถามที่พบบ่อย](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="เครื่องมือแก้ไขเลย์เอาต์ LCD NZXT Kraken แบบลากวางของ NZXT-ESC"
       width="70%" />

> [!NOTE]
> **NZXT-ESC เป็นโครงการชุมชนอิสระ** ไม่ได้เป็นพันธมิตร ได้รับการสนับสนุน หรือได้รับการรับรองจาก NZXT

หาก NZXT-ESC ช่วยให้ชุดของคุณดีขึ้น คุณสามารถสนับสนุนการพัฒนาต่อไปได้:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## ปรับแต่ง LCD ของ NZXT Kraken โดยไม่ถูกจำกัดด้วยเลย์เอาต์ตายตัว

NZXT-ESC เปลี่ยนหน้าจอ NZXT Kraken ให้เป็นพื้นที่ออกแบบอิสระ สร้างหน้าจอ LCD ของคุณเองโดยวางเซนเซอร์ กราฟิก นาฬิกา รูปภาพ หรือสื่อแต่ละรายการไว้ตรงตำแหน่งที่ต้องการ ปรับขนาด หมุน เรียงลำดับ เปลี่ยนชื่อ ล็อก และปรับสไตล์ พร้อมดูผลลัพธ์อัปเดตสดผ่าน NZXT CAM

ตัวแก้ไขหลัก **ไม่ต้องมีบัญชี** และ **ไม่ต้องติดตั้งแยกสำหรับผู้ใช้ปลายทาง** พรีเซ็ตและสื่อในเครื่องจะเก็บอยู่ในพื้นที่จัดเก็บของเบราว์เซอร์ โอเวอร์เลย์เพลงที่เป็นตัวเลือกจะใช้แอปคู่หู Windows ในเครื่อง [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

<a id="quick-start"></a>
## เริ่มต้นใช้งาน

### เปิดโดยตรงใน NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. คลิก **Open NZXT-ESC in NZXT CAM**
2. อนุญาตให้เบราว์เซอร์เปิด NZXT CAM
3. ยืนยัน **Load Web Integration**
4. เปิดการ์ด Web Integration ใหม่แล้วเลือก **Configure**
5. สร้างเลย์เอาต์ของคุณ การเปลี่ยนแปลงจะซิงค์กับหน้าจอ Kraken

<details>
<summary><strong>ตั้งค่าด้วยตนเองภายใน NZXT CAM</strong></summary>

1. เปิด **NZXT CAM**
2. ไปที่ **Lighting → Kraken → LCD Display**
3. เลือก **Web Integration**
4. เปิดการตั้งค่า **Custom Web Integration**
5. ใส่ URL ต่อไปนี้:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. เลือก **Apply** แล้วเลือก **Add as Card**
7. เปิดการ์ดใหม่แล้วเลือก **Configure**

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="หน้าจอตั้งค่า NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="เพิ่ม NZXT-ESC เป็นการ์ด NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## ดูการทำงานจริง

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="พรีเซ็ต LCD NZXT Kraken แบบกำหนดเองที่สร้างด้วย NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="เลย์เอาต์หน้าจอ NZXT Kraken แบบเคลื่อนไหวใน NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="โอเวอร์เลย์เซนเซอร์ NZXT CAM แบบสดบน LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="หน้าจอ LCD Kraken แบบกำหนดเองและเคลื่อนไหวผ่าน NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## คุณสมบัติ

| ความสามารถ | สิ่งที่คุณได้รับ |
|---|---|
| **ตัวแก้ไขเลย์เอาต์อิสระ** | ลาก ปรับขนาด หมุน จัดชั้น ล็อก เปลี่ยนชื่อ และวางทุกองค์ประกอบได้อย่างแม่นยำ |
| **ข้อมูลเซนเซอร์ NZXT CAM แบบสด** | สร้างหน้าจอ CPU, GPU, RAM, อุณหภูมิน้ำหล่อเย็น กำลังไฟ ความถี่ และความเร็วพัดลมในแบบของคุณ |
| **กราฟิกขั้นสูง** | รวมกราฟเซนเซอร์แบบรัศมี เส้นตรง วงกลม และประวัติไว้ในเลย์เอาต์เดียว |
| **พื้นหลังแบบเคลื่อนไหว** | ใช้สี ไล่ระดับ รูปภาพในเครื่อง GIF วิดีโอ MP4 URL สื่อโดยตรง YouTube และ Pinterest |
| **การเชื่อมต่อ Now Playing** | แสดงปกอัลบั้ม ข้อมูลเพลง และภาพตอบสนองต่อเสียงจากไคลเอนต์ Windows ในเครื่อง |
| **Explore และ Library** | นำเข้าพรีเซ็ตชุมชน แก้ไขได้ทุกส่วน จัดการรายการโปรด และดูแลคอลเลกชันพรีเซ็ตในเครื่องของคุณ |
| **จัดเก็บในเครื่องเป็นหลัก** | พรีเซ็ตใช้ LocalStorage ส่วนสื่อในเครื่องใช้ IndexedDB และยังคงอยู่บนอุปกรณ์ของคุณ |
| **ตัวแก้ไขหลายภาษา** | ใช้งานอินเทอร์เฟซได้ใน 18 ภาษาที่รองรับ |

### องค์ประกอบโอเวอร์เลย์

ตัวแก้ไขปัจจุบันแบ่งองค์ประกอบโอเวอร์เลย์ออกเป็นสี่หมวดหมู่ที่ชัดเจน:

| เนื้อหา | ข้อมูล | เวลา | เสียง |
|---|---|---|---|
| ข้อความ | เซนเซอร์ | นาฬิกาดิจิทัล | ปกอัลบั้ม |
| รูปร่าง | กราฟรัศมี | นาฬิกาแอนะล็อก | ข้อความ Now Playing |
| ไอคอน | กราฟเส้น | วันที่ | ตัวแสดงภาพเสียง |
| สติกเกอร์ | กราฟวงกลม |  |  |
| รูปภาพ | กราฟเซนเซอร์ |  |  |

เมื่อเป็นไปได้ ทุกองค์ประกอบจะใช้ขั้นตอนการทำงานแบบเดียวกัน: เลือกจากหน้าพรีวิวหรือรายการเลเยอร์ แล้วปรับตำแหน่ง ขนาด การหมุน ลำดับ สไตล์ และการตั้งค่าเฉพาะประเภท

### การตรวจสอบฮาร์ดแวร์

สร้างเลย์เอาต์แบบสดด้วยข้อมูลตรวจสอบที่ NZXT CAM มีให้ เช่น:

`อุณหภูมิ CPU` · `โหลด CPU` · `ความถี่ CPU` · `กำลังไฟ CPU` · `ความเร็วพัดลม CPU` · `อุณหภูมิ GPU` · `โหลด GPU` · `ความถี่ GPU` · `กำลังไฟ GPU` · `ความเร็วพัดลม GPU` · `การใช้ RAM` · `อุณหภูมิน้ำหล่อเย็น`

ระบบที่มีหลาย GPU สามารถเลือก GPU ที่กำลังทำงานโดยอัตโนมัติหรือกำหนด GPU เฉพาะได้ เมื่อ API ของ NZXT CAM ไม่พร้อมใช้งาน ตัวแก้ไขในเบราว์เซอร์จะแสดงค่าจำลองเพื่อให้ยังออกแบบและพรีวิวเลย์เอาต์ได้

### พื้นหลังและสื่อ

ใช้สีทึบหรือไล่ระดับเป็นพื้นฐาน แล้วเพิ่มสื่อจาก:

- ไฟล์ PNG, JPG, GIF, WebP หรือ MP4 ในเครื่อง
- URL รูปภาพและวิดีโอโดยตรง
- วิดีโอ YouTube
- ลิงก์สื่อ Pinterest

สามารถจัดตำแหน่ง ปรับขนาด ปรับให้พอดี และรวมสื่อพื้นหลังกับเลย์เอาต์โอเวอร์เลย์ใดก็ได้ ไฟล์ในเครื่องถูกเก็บใน IndexedDB และ NZXT-ESC จะไม่อัปโหลดไฟล์เหล่านั้น

### พรีเซ็ต, Explore และ Library

- บันทึกและจัดระเบียบ **พรีเซ็ตแบบกำหนดเองได้สูงสุด 20 รายการ** ใน Library ภายในเครื่อง
- สร้างแต่ละพรีเซ็ตด้วย **องค์ประกอบโอเวอร์เลย์ได้สูงสุด 40 รายการ**
- นำเข้าและส่งออกไฟล์พรีเซ็ตที่แก้ไขได้เพื่อสำรองหรือแชร์
- เรียกดูเลย์เอาต์ที่ชุมชนสร้างผ่าน **Explore**
- เพิ่มพรีเซ็ตจาก Explore ไปยัง Library แล้วปรับแต่งให้เป็นของคุณเอง
- ซิงค์การแก้ไขและการเรนเดอร์ Kraken ระหว่างสองมุมมองของ NZXT CAM

## Now Playing และตัวแสดงภาพเสียง

ไคลเอนต์ Windows แบบเลือกใช้ [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) ทำงานในเครื่องและส่งข้อมูลเซสชันสื่อกับสเปกตรัมเสียงไปยัง NZXT-ESC ผ่านการเชื่อมต่อ WebSocket ในเครื่อง

ใช้เพื่อเพิ่ม:

- **ปกอัลบั้ม** ภาพปัจจุบันพร้อมการควบคุมขนาด เส้นขอบ และมุม
- **ข้อความ Now Playing** ชื่อเพลง ศิลปิน หรืออัลบั้ม พร้อมการเลื่อนข้อความยาว
- **ตัวแสดงภาพเสียง** สเปกตรัมและรูปคลื่นแบบเรียลไทม์ที่ปรับแต่งได้

ไม่ได้จำกัดเฉพาะ Spotify แอปคู่หูสามารถอ่านเซสชันสื่อ Windows ที่รองรับและเสียงระบบจากเบราว์เซอร์ โปรแกรมเล่นสื่อ และแอปอื่น ๆ

<a id="languages"></a>
## ภาษา

ขณะนี้ตัวแก้ไขรองรับ:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**เอกสารที่แปลแล้ว:**
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

## ความเป็นส่วนตัวและการจัดเก็บในเครื่อง

NZXT-ESC ออกแบบโดยยึดการจัดเก็บภายในเบราว์เซอร์เป็นหลัก:

- การตั้งค่าพรีเซ็ตถูกเก็บใน **LocalStorage**
- รูปภาพและวิดีโอในเครื่องถูกเก็บใน **IndexedDB**
- ค่าจากเซนเซอร์ NZXT CAM และพรีเซ็ตที่ผู้ใช้สร้างจะไม่ถูกส่งไปยังระบบวิเคราะห์
- แอปไม่ได้ตั้งใจเก็บข้อมูลที่สามารถระบุตัวบุคคลได้

เว็บไซต์เวอร์ชันใช้งานจริงใช้ **Google Tag Manager** และ **Google Analytics 4** สำหรับการวิเคราะห์ผลิตภัณฑ์แบบไม่ระบุตัวตน **CookieYes** จัดการความยินยอมเมื่อจำเป็น และคุกกี้วิเคราะห์แบบเลือกใช้จะเปิดตามการตัดสินใจของผู้ใช้ เวอร์ชันพัฒนาไม่ต้องใช้บริการวิเคราะห์ของระบบจริง

## การพัฒนา

### รันในเครื่อง

```bash
npm install
npm run dev
```

เปิด `http://localhost:5173` ตัวแก้ไขจะใช้ข้อมูลฮาร์ดแวร์จำลองเมื่อ NZXT CAM ไม่พร้อมใช้งาน

```bash
npm run build   # ตรวจสอบชนิดข้อมูลและสร้าง production build
npm test        # รันการตรวจสอบ i18n และชุดทดสอบ Vitest
```

### สถาปัตยกรรม

<details>
<summary><strong>โครงสร้างโครงการและหลักการออกแบบ</strong></summary>

```text
src/
├─ core/       สัญญาโดเมนสำหรับพรีเซ็ต โอเวอร์เลย์ องค์ประกอบ และพื้นหลัง
├─ render/     เอนจินร่วมจากพรีเซ็ตไปยังโมเดลเรนเดอร์
├─ storage/    สถานะ LocalStorage การนำเข้า/ส่งออก และสื่อ IndexedDB
├─ platform/   อะแดปเตอร์ NZXT CAM และแอปคู่หูในเครื่อง
├─ sync/       การซิงค์ระหว่างเอดิเตอร์และรันไทม์
├─ i18n/       ข้อความภาษาแบบมีชนิดและยูทิลิตีการแปล
└─ ui/
   ├─ config/  ตัวแก้ไขการตั้งค่าแบบลากวาง
   ├─ kraken/  รันไทม์หน้าจอ Kraken แบบเบา
   └─ shared/  คอมโพเนนต์อินเทอร์เฟซที่ใช้ซ้ำได้
```

หน้าพรีวิวของเอดิเตอร์และรันไทม์ Kraken ใช้เส้นทางเรนเดอร์มาตรฐานเดียวกัน เอนจินร่วมนี้ช่วยให้เลย์เอาต์ สไตล์ และการแปลงตรงกันระหว่างสิ่งที่ผู้ใช้ออกแบบกับสิ่งที่แสดงบนหน้าจอจริง

ข้อมูลพรีเซ็ตจะถูกปรับให้อยู่ในรูปแบบมาตรฐานก่อนจัดเก็บ การนำเข้า/ส่งออกมีการกำหนดเวอร์ชัน และการอัปเดตเอดิเตอร์ซิงค์ผ่าน `BroadcastChannel` โดยใช้ `localStorage` เป็นตัวสำรอง

</details>

### การมีส่วนร่วม

ยินดีต้อนรับการมีส่วนร่วมและ pull request ที่มีขอบเขตชัดเจน ก่อนเปลี่ยนแปลงสถาปัตยกรรม โปรดอ่าน:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [จรรยาบรรณ](../CODE_OF_CONDUCT.md)
- [นโยบายความปลอดภัย](../SECURITY.md)

<a id="faq"></a>
## คำถามที่พบบ่อย

<details>
<summary><strong>ต้องติดตั้ง NZXT-ESC หรือไม่?</strong></summary>

ตัวแก้ไขหลักไม่ต้องติดตั้งแยก เพียงเปิดผ่าน NZXT CAM Web Integration เฉพาะโอเวอร์เลย์เพลงแบบเลือกใช้เท่านั้นที่ต้องมีไคลเอนต์ Windows NowPlaying.WebSocket ในเครื่อง

</details>

<details>
<summary><strong>NZXT-ESC ทำงานได้โดยไม่มี NZXT CAM หรือไม่?</strong></summary>

สามารถเปิดตัวแก้ไขในเบราว์เซอร์ปกติและใช้ค่าเซนเซอร์จำลองเพื่อออกแบบได้ แต่การตรวจสอบฮาร์ดแวร์แบบสดและการแสดงผลบนหน้าจอ Kraken ต้องใช้ NZXT CAM Web Integration

</details>

<details>
<summary><strong>รองรับ NZXT Kraken รุ่นใดบ้าง?</strong></summary>

NZXT-ESC ออกแบบสำหรับอุปกรณ์ NZXT Kraken ที่รองรับโหมดแสดงผล NZXT CAM Web Integration ขนาดและรูปทรงหน้าจอที่ใช้ได้จะถูกตรวจสอบผ่าน API ของ NZXT CAM

</details>

<details>
<summary><strong>พรีเซ็ตและสื่อในเครื่องถูกเก็บไว้ที่ไหน?</strong></summary>

พรีเซ็ตเก็บใน LocalStorage ของเบราว์เซอร์ ส่วนรูปภาพและวิดีโอในเครื่องเก็บใน IndexedDB ควรส่งออกพรีเซ็ตสำคัญเป็นประจำเมื่อต้องย้ายเบราว์เซอร์ ติดตั้ง Windows ใหม่ หรือเปลี่ยนคอมพิวเตอร์

</details>

<details>
<summary><strong>Now Playing ต้องใช้ Spotify หรือไม่?</strong></summary>

ไม่จำเป็น NowPlaying.WebSocket ใช้เซสชันสื่อ Windows ที่รองรับและเสียงระบบ จึงทำงานกับเบราว์เซอร์และแอปสื่ออื่นที่เข้ากันได้

</details>

<details>
<summary><strong>แก้ไขพรีเซ็ตจากชุมชนได้หรือไม่?</strong></summary>

ได้ พรีเซ็ตที่นำเข้าจาก Explore สามารถแก้ไขได้ทั้งหมดหลังเพิ่มลงใน Library

</details>

<a id="license"></a>
## สัญญาอนุญาต

NZXT-ESC เผยแพร่ภายใต้ **สัญญาอนุญาตสำหรับการใช้งานส่วนบุคคล**

**อนุญาต:** การใช้งานส่วนบุคคล การแก้ไขส่วนบุคคล และการแจกจ่ายซ้ำโดยให้เครดิตโครงการต้นฉบับอย่างชัดเจน

**การใช้งานเชิงพาณิชย์:** การขาย การรวมเป็นแพ็กเกจ การให้เช่า การนำไปใช้ในผลิตภัณฑ์ที่มีค่าใช้จ่าย หรือการสร้างรายได้ในรูปแบบอื่น ต้องได้รับอนุญาตเป็นลายลักษณ์อักษรล่วงหน้าจากเจ้าของโครงการ
ดูเงื่อนไขทั้งหมดได้ที่ [LICENSE](../LICENSE).

## การสนับสนุนและลิงก์

- **เว็บไซต์:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **รุ่นล่าสุด:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **รายงานข้อผิดพลาดและไอเดีย:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **แอปคู่หู:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

หาก NZXT-ESC ช่วยให้ชุดของคุณดีขึ้น คุณสามารถสนับสนุนการพัฒนาต่อไปได้:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

สร้างโดย **Gökhan AKGÜL (mRGogo)** ขับเคลื่อนด้วยกาแฟและตารางการนอนที่น่าสงสัย
