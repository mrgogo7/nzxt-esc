# NZXT-ESC - 최고의 NZXT Web Integration

### NZXT Kraken AIO용 고급 화면 사용자 지정 레이아웃 편집기

드래그 앤 드롭 센서 오버레이, 사용자 지정 글꼴, 이미지, GIF, MP4 동영상, 시계, 그래프, Now Playing 정보, 사운드 반응형 비주얼을 사용해 완전히 편집 가능한 NZXT Kraken LCD 레이아웃을 만들고 **NZXT CAM Web Integration**을 통해 실시간으로 표시할 수 있습니다.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[NZXT CAM에서 열기](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [웹 편집기 열기](https://nzxt-esc.pages.dev/)
· [지원되는 Kraken 모델](#supported-nzxt-kraken-lcd-models)
· [기능](#features)
· [빠른 시작](#quick-start)
· [FAQ](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="NZXT-ESC 드래그 앤 드롭 NZXT Kraken LCD 레이아웃 편집기"
       width="70%" />

> [!NOTE]
> **NZXT-ESC는 독립적인 커뮤니티 프로젝트입니다.** NZXT와 제휴되어 있지 않으며 NZXT의 후원 또는 보증을 받지 않습니다.

> [!IMPORTANT]
> ### 호스팅 사용량 및 Supporter Access
>
> NZXT-ESC의 호스팅 버전은 Supporter Access가 필요하기 전까지
> 최대 **100시간** 사용할 수 있습니다.
>
> 100시간이 지난 후에도 계속 호스팅 서비스를 이용하려면 프로젝트를
> 후원해야 합니다. 후원자는 100시간 사용 제한을 없애주는
> Supporter Access 코드를 받습니다.
>
> 커뮤니티의 후원은 서버, API, 호스팅, 유지 관리 및 지속적인
> 개발 비용을 충당하는 데 도움이 됩니다.

NZXT-ESC가 설정을 더 좋게 만들었다면 지속적인 개발을 지원할 수 있습니다:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## 고정 레이아웃 없는 NZXT Kraken LCD 사용자 지정

NZXT-ESC는 NZXT Kraken 디스플레이를 자유롭게 배치할 수 있는 캔버스로 바꿉니다. 센서, 그래픽, 시계, 이미지 또는 미디어 요소를 원하는 위치에 정확히 배치해 사용자 지정 LCD 화면을 만들 수 있습니다. 요소의 크기, 회전, 순서, 이름, 잠금 및 스타일을 조정하면서 NZXT CAM에서 결과가 실시간으로 업데이트되는 모습을 확인하세요.

기본 편집기는 **계정이 필요 없고**, **최종 사용자를 위한 별도 설치도 필요하지 않습니다**. 프리셋과 로컬 미디어는 브라우저 저장소에 유지됩니다. 선택 사항인 음악 오버레이는 로컬 Windows 보조 앱 [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)을 사용합니다.

<a id="supported-nzxt-kraken-lcd-models"></a>

## 지원되는 NZXT Kraken LCD 모델

NZXT-ESC는 LCD 디스플레이와 NZXT CAM Web Integration을 갖춘 NZXT Kraken AIO 수랭 쿨러를 지원하며, 현재 및 이전 세대의 Kraken Elite, Kraken Plus, Kraken, Kraken Z 모델을 포함합니다.

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

NZXT-ESC는 NZXT CAM API를 통해 보고되는 Kraken LCD의 해상도, 크기, 화면 형태에 맞춰 레이아웃을 자동으로 조정하므로, 사용자 지정 레이아웃, 센서 오버레이, 애니메이션 배경, 그래픽, 미디어를 NZXT CAM Web Integration을 통해 표시할 수 있습니다.

<a id="quick-start"></a>
## 빠른 시작

### NZXT CAM에서 바로 열기

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. **Open NZXT-ESC in NZXT CAM**을 클릭합니다.
2. 브라우저가 NZXT CAM을 열도록 허용합니다.
3. **Load Web Integration**을 확인합니다.
4. 새 Web Integration 카드를 열고 **Configure**를 선택합니다.
5. 레이아웃을 만들면 변경 사항이 Kraken 디스플레이와 동기화됩니다.

<details>
<summary><strong>NZXT CAM에서 수동 설정</strong></summary>

1. **NZXT CAM**을 엽니다.
2. **Lighting → Kraken → LCD Display**로 이동합니다.
3. **Web Integration**을 선택합니다.
4. **Custom Web Integration** 설정을 엽니다.
5. 다음을 입력합니다:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. **Apply**를 선택한 뒤 **Add as Card**를 선택합니다.
7. 새 카드를 열고 **Configure**를 선택합니다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="NZXT CAM Web Integration 설정 화면"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="NZXT-ESC를 NZXT CAM Web Integration 카드로 추가"
       width="48%" />
</p>

</details>

## 실제 동작 보기

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="NZXT-ESC로 만든 사용자 지정 NZXT Kraken LCD 프리셋"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="NZXT-ESC의 애니메이션 NZXT Kraken 디스플레이 레이아웃"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Kraken LCD의 실시간 NZXT CAM 센서 오버레이"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="NZXT CAM을 통해 실행되는 사용자 지정 애니메이션 Kraken LCD 화면"
       width="48%" />
</p>

<a id="features"></a>
## 기능

| 기능 | 제공되는 가치 |
|---|---|
| **자유 배치 레이아웃 편집기** | 모든 요소를 드래그하고 크기 조절, 회전, 레이어 정렬, 잠금, 이름 변경 및 정밀 배치할 수 있습니다. |
| **실시간 NZXT CAM 센서 데이터** | CPU, GPU, RAM, 냉각수 온도, 전력, 주파수, 팬 속도용 사용자 지정 화면을 만들 수 있습니다. |
| **고급 그래픽** | 방사형, 선형, 원형 및 기록형 센서 그래프를 하나의 레이아웃에 조합할 수 있습니다. |
| **애니메이션 배경** | 색상, 그라데이션, 로컬 이미지, GIF, MP4 동영상, 직접 미디어 URL, YouTube 및 Pinterest를 사용할 수 있습니다. |
| **Now Playing 연동** | 로컬 Windows 클라이언트에서 앨범 아트, 트랙 정보 및 사운드 반응형 비주얼을 표시할 수 있습니다. |
| **Explore 및 Library** | 커뮤니티 프리셋을 가져오고 모든 부분을 편집하며 즐겨찾기와 로컬 컬렉션을 관리할 수 있습니다. |
| **로컬 우선 저장** | 프리셋은 LocalStorage를, 로컬 미디어는 IndexedDB를 사용하며 데이터는 기기에 남습니다. |
| **다국어 편집기** | 18개 지원 언어로 인터페이스를 사용할 수 있습니다. |

### 오버레이 요소

현재 편집기는 오버레이 요소를 네 가지 명확한 범주로 구분합니다:

| 콘텐츠 | 데이터 | 시간 | 오디오 |
|---|---|---|---|
| 텍스트 | 센서 | 디지털 시계 | 앨범 커버 |
| 도형 | 방사형 그래픽 | 아날로그 시계 | Now Playing 텍스트 |
| 아이콘 | 선형 그래픽 | 날짜 | 오디오 비주얼라이저 |
| 스티커 | 원형 그래픽 |  |  |
| 이미지 | 센서 차트 |  |  |

가능한 경우 모든 요소는 동일한 시각적 작업 흐름을 사용합니다. 미리 보기 또는 레이어 목록에서 요소를 선택한 다음 위치, 크기, 회전, 순서, 스타일 및 유형별 설정을 조정합니다.

### 하드웨어 모니터링

NZXT CAM에서 제공되는 다음 모니터링 데이터로 실시간 레이아웃을 만들 수 있습니다:

`CPU 온도` · `CPU 부하` · `CPU 주파수` · `CPU 전력` · `CPU 팬 속도` · `GPU 온도` · `GPU 부하` · `GPU 주파수` · `GPU 전력` · `GPU 팬 속도` · `RAM 사용량` · `냉각수 온도`

다중 GPU 시스템은 활성 GPU를 자동으로 선택하거나 특정 GPU를 지정할 수 있습니다. NZXT CAM API를 사용할 수 없을 때에도 브라우저 편집기가 모의 값을 제공하므로 레이아웃을 계속 설계하고 미리 볼 수 있습니다.

### 배경 및 미디어

단색 또는 그라데이션을 기본으로 사용한 뒤 다음 소스에서 미디어를 추가할 수 있습니다:

- 로컬 PNG, JPG, GIF, WebP 또는 MP4 파일
- 이미지 및 동영상 직접 URL
- YouTube 동영상
- Pinterest 미디어 링크

배경 미디어는 위치, 크기, 맞춤 방식을 조정하고 모든 오버레이 레이아웃과 결합할 수 있습니다. 로컬 파일은 IndexedDB에 저장되며 NZXT-ESC가 업로드하지 않습니다.

### 프리셋, Explore 및 Library

- 로컬 Library에 최대 **20개의 사용자 지정 프리셋**을 저장하고 정리할 수 있습니다.
- 각 프리셋에 최대 **40개의 오버레이 요소**를 사용할 수 있습니다.
- 백업 또는 공유를 위해 편집 가능한 프리셋 파일을 가져오고 내보낼 수 있습니다.
- **Explore**에서 커뮤니티가 만든 레이아웃을 둘러볼 수 있습니다.
- Explore 프리셋을 Library에 추가하고 자유롭게 편집해 자신만의 디자인으로 만들 수 있습니다.
- 두 NZXT CAM 보기 간에 편집과 Kraken 렌더링을 동기화할 수 있습니다.

## Now Playing 및 오디오 비주얼라이저

선택 사항인 Windows 클라이언트 [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)은 로컬에서 실행되며 미디어 세션과 오디오 스펙트럼 데이터를 로컬 WebSocket 연결을 통해 NZXT-ESC로 전송합니다.

다음 요소를 추가할 수 있습니다:

- **앨범 커버** 크기, 테두리 및 모서리 설정이 가능한 현재 아트워크
- **Now Playing 텍스트** 긴 텍스트 스크롤을 지원하는 제목, 아티스트 또는 앨범
- **오디오 비주얼라이저** 사용자 지정 가능한 실시간 스펙트럼 및 파형 비주얼

Spotify에만 제한되지 않습니다. 보조 앱은 브라우저, 미디어 플레이어 및 기타 앱의 지원되는 Windows 미디어 세션과 시스템 오디오 출력을 읽습니다.

<a id="languages"></a>
## 언어

현재 편집기는 다음 언어를 지원합니다:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**번역된 문서:**
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

## 개인정보 보호 및 로컬 저장

NZXT-ESC는 브라우저의 로컬 저장을 중심으로 설계되었습니다:

- 프리셋 설정은 **LocalStorage**에 저장됩니다.
- 로컬 이미지와 동영상은 **IndexedDB**에 저장됩니다.
- NZXT CAM 센서 값과 사용자가 만든 프리셋은 분석 서비스로 전송되지 않습니다.
- 앱은 개인 식별 정보를 의도적으로 수집하지 않습니다.

프로덕션 웹사이트는 선택적인 익명 제품 분석을 위해 **Google Tag Manager**와 **Google Analytics 4**를 사용합니다. 필요한 경우 **CookieYes**가 동의를 관리하며, Google Analytics 쿠키는 사용자의 동의 선택에 따라 활성화됩니다.

배포된 웹사이트는 Cloudflare Pages를 통해 활성화되고 Google Tag Manager와 독립적으로 작동하는 **Cloudflare Web Analytics**도 사용합니다. 이는 쿠키나 LocalStorage를 사용하지 않고 개인정보를 보호하는 웹사이트 트래픽 및 성능 분석을 제공합니다.

### 기여

기여와 범위가 명확한 Pull Request를 환영합니다. 아키텍처 변경 전에 다음 문서를 읽어 주세요:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [행동 강령](../CODE_OF_CONDUCT.md)
- [보안 정책](../SECURITY.md)

<a id="faq"></a>
## 자주 묻는 질문

<details>
<summary><strong>NZXT-ESC를 설치해야 하나요?</strong></summary>

기본 편집기는 별도 설치가 필요 없습니다. NZXT CAM Web Integration을 통해 여세요. 선택 사항인 음악 오버레이만 로컬 NowPlaying.WebSocket Windows 클라이언트가 필요합니다.

</details>

<details>
<summary><strong>NZXT CAM 없이 NZXT-ESC를 사용할 수 있나요?</strong></summary>

일반 브라우저에서 편집기를 열고 모의 센서 값을 사용해 디자인할 수 있습니다. 실시간 하드웨어 모니터링과 Kraken 디스플레이 출력에는 NZXT CAM Web Integration이 필요합니다.

</details>

<details>
<summary><strong>어떤 NZXT Kraken 모델을 지원하나요?</strong></summary>

NZXT-ESC는 NZXT CAM Web Integration 디스플레이 모드를 제공하는 LCD 탑재 **NZXT Kraken Elite, Kraken Plus, Kraken (2023), Kraken Z 시리즈** 쿨러를 지원합니다.

전체 목록은 [지원되는 NZXT Kraken LCD 모델](#supported-nzxt-kraken-lcd-models)에서 확인할 수 있습니다.

</details>

<details>
<summary><strong>프리셋과 로컬 미디어는 어디에 저장되나요?</strong></summary>

프리셋은 브라우저 LocalStorage에, 로컬 이미지와 동영상은 IndexedDB에 저장됩니다. 브라우저, Windows 설치 또는 컴퓨터를 변경할 때 중요한 프리셋을 정기적으로 내보내세요.

</details>

<details>
<summary><strong>Now Playing에 Spotify가 필요한가요?</strong></summary>

아니요. NowPlaying.WebSocket은 지원되는 Windows 미디어 세션과 시스템 오디오를 사용하므로 브라우저와 다른 호환 미디어 앱에서도 작동할 수 있습니다.

</details>

<details>
<summary><strong>커뮤니티 프리셋을 편집할 수 있나요?</strong></summary>

네. Explore에서 가져온 프리셋은 Library에 추가한 뒤 완전히 편집할 수 있습니다.

</details>

<details>
<summary><strong>100시간 사용 제한은 어떻게 작동하나요?</strong></summary>

NZXT-ESC의 호스팅 버전은 Supporter Access가 필요하기 전까지 최대
100시간 사용할 수 있습니다.

사용 기간이 끝난 후 프로젝트를 후원하는 사용자는 100시간 사용
제한을 없애주는 Supporter Access 코드를 받습니다.

이 사용 정책은 서버, API, 호스팅, 유지 관리 및 지속적인 개발
비용을 충당하는 데 도움이 되며, 후원 여부를 결정하기 전에
사용자가 프로젝트를 충분히 경험할 수 있는 시간을 제공합니다.

사용 시간은 NZXT-ESC가 Kraken 디스플레이에서 실제로 실행되는 동안 계산됩니다.

</details>

<a id="license"></a>
## 라이선스

NZXT-ESC는 **개인 사용 라이선스**로 배포됩니다.

**허용:** 개인 사용, 개인 수정 및 원본 프로젝트를 명확히 표시한 재배포.

**상업적 사용:** 판매, 번들 제공, 임대, 유료 제품 통합 또는 기타 수익화 사용에는 프로젝트 소유자의 사전 서면 허가가 필요합니다.
전체 조건은 [LICENSE를 확인하세요](../LICENSE).

## 지원 및 커뮤니티

- **웹사이트:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **최신 릴리스:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **버그 신고 및 아이디어:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

쇼케이스, 새로운 기능, 튜토리얼, 커뮤니티 설정, 프로젝트 업데이트 소식을 받으려면 YouTube와 Instagram에서 NZXT-ESC를 팔로우하세요.

NZXT-ESC가 설정을 더 좋게 만들었다면 지속적인 개발을 지원할 수 있습니다:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

**Gökhan AKGÜL (mRGogo)** 제작 - 커피와 의심스러운 수면 일정으로 구동됩니다.
