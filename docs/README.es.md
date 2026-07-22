# NZXT-ESC

### Editor avanzado de diseños y personalización de pantalla para NZXT Kraken AIO

Crea diseños LCD totalmente editables para NZXT Kraken con capas de sensores de arrastrar y soltar, fuentes personalizadas, imágenes, GIF, vídeo MP4, relojes, gráficos, datos de reproducción y visuales reactivos al sonido, renderizados en tiempo real mediante **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-18-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Abrir en NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Abrir editor web](https://nzxt-esc.pages.dev/)
· [Funciones](#features)
· [Inicio rápido](#quick-start)
· [Preguntas frecuentes](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Editor de diseños LCD NZXT Kraken con arrastrar y soltar de NZXT-ESC"
       width="70%" />

> [!NOTE]
> **NZXT-ESC es un proyecto comunitario independiente.** No está afiliado, patrocinado ni respaldado por NZXT.

## Personalización del LCD de NZXT Kraken sin diseños fijos

NZXT-ESC convierte la pantalla NZXT Kraken en un lienzo de formato libre. Crea una pantalla LCD personalizada colocando cada sensor, gráfico, reloj, imagen o elemento multimedia exactamente donde quieras. Cambia el tamaño, gira, reordena, renombra, bloquea y aplica estilos a los elementos mientras ves el resultado actualizarse en tiempo real mediante NZXT CAM.

El editor principal **no requiere una cuenta** ni **una instalación independiente para el usuario final**. Los presets y los archivos multimedia locales permanecen en el almacenamiento del navegador. Las capas de música opcionales utilizan la aplicación complementaria local para Windows [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="quick-start"></a>
## Inicio rápido

### Abrir directamente en NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Haz clic en **Open NZXT-ESC in NZXT CAM**.
2. Permite que el navegador abra NZXT CAM.
3. Confirma **Load Web Integration**.
4. Abre la nueva tarjeta de Web Integration y selecciona **Configure**.
5. Crea tu diseño; los cambios se sincronizan con la pantalla Kraken.

<details>
<summary><strong>Configuración manual dentro de NZXT CAM</strong></summary>

1. Abre **NZXT CAM**.
2. Ve a **Lighting → Kraken → LCD Display**.
3. Selecciona **Web Integration**.
4. Abre la configuración de **Custom Web Integration**.
5. Introduce:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Selecciona **Apply** y después **Add as Card**.
7. Abre la nueva tarjeta y selecciona **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Pantalla de configuración de NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Añadir NZXT-ESC como tarjeta de NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Míralo en acción

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Preset LCD personalizado para NZXT Kraken creado con NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Diseño animado para la pantalla NZXT Kraken en NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Capa de sensores de NZXT CAM en tiempo real sobre un LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Pantalla LCD Kraken animada y personalizada ejecutándose mediante NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Funciones

| Capacidad | Qué te ofrece |
|---|---|
| **Editor de formato libre** | Arrastra, cambia el tamaño, gira, superpone, bloquea, renombra y coloca con precisión cada elemento. |
| **Datos de sensores de NZXT CAM en tiempo real** | Crea pantallas personalizadas de CPU, GPU, RAM, temperatura del líquido, potencia, frecuencia y velocidad de ventiladores. |
| **Gráficos avanzados** | Combina gráficos radiales, lineales, circulares e históricos de sensores en un mismo diseño. |
| **Fondos animados** | Utiliza colores, degradados, imágenes locales, GIF, vídeo MP4, URL multimedia directas y fuentes de YouTube y Pinterest. |
| **Integración de reproducción** | Muestra la carátula del álbum, la información de la pista y visuales reactivos al sonido desde un cliente local de Windows. |
| **Explore y Library** | Importa presets de la comunidad, edita cada parte, organiza favoritos y conserva tu propia colección local. |
| **Almacenamiento local primero** | Los presets usan LocalStorage; los medios locales usan IndexedDB y permanecen en tu dispositivo. |
| **Editor multilingüe** | Utiliza la interfaz en 18 idiomas compatibles. |

### Elementos de capa

El editor actual agrupa los elementos de capa en cuatro categorías claras:

| Contenido | Datos | Tiempo | Audio |
|---|---|---|---|
| Texto | Sensor | Reloj digital | Carátula del álbum |
| Forma | Gráfico radial | Reloj analógico | Texto de reproducción |
| Icono | Gráfico lineal | Fecha | Visualizador de audio |
| Pegatina | Gráfico circular |  |  |
| Imagen | Gráfico de sensores |  |  |

Siempre que es posible, todos los elementos utilizan el mismo flujo visual: selecciónalos en la vista previa o en la lista de capas y ajusta su posición, tamaño, rotación, orden, estilo y opciones específicas.

### Supervisión de hardware

Crea diseños en tiempo real con los datos de supervisión disponibles de NZXT CAM, incluidos:

`temperatura de CPU` · `carga de CPU` · `frecuencia de CPU` · `potencia de CPU` · `velocidad del ventilador de CPU` · `temperatura de GPU` · `carga de GPU` · `frecuencia de GPU` · `potencia de GPU` · `velocidad del ventilador de GPU` · `uso de RAM` · `temperatura del líquido`

Los sistemas con varias GPU pueden seleccionar automáticamente la GPU activa o utilizar una GPU específica. El editor del navegador también proporciona valores simulados cuando la API de NZXT CAM no está disponible, de modo que los diseños se pueden seguir creando y previsualizando.

### Fondos y contenido multimedia

Utiliza un color sólido o un degradado como base y añade contenido desde:

- Archivos locales PNG, JPG, GIF, WebP o MP4
- URL directas de imágenes y vídeos
- Vídeos de YouTube
- Enlaces multimedia de Pinterest

El contenido de fondo puede posicionarse, escalarse, ajustarse y combinarse con cualquier diseño de capas. Los archivos locales se guardan en IndexedDB y NZXT-ESC no los sube.

### Presets, Explore y Library

- Guarda y organiza hasta **20 presets personalizados** en la Library local.
- Crea cada preset con hasta **40 elementos de capa**.
- Importa y exporta archivos de preset editables para hacer copias de seguridad o compartirlos.
- Explora diseños creados por la comunidad mediante **Explore**.
- Añade un preset de Explore a la Library, personalízalo y hazlo tuyo.
- Mantén sincronizados la edición y el renderizado de Kraken entre las dos vistas de NZXT CAM.

## Reproducción y visualizador de audio

El cliente opcional para Windows [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) se ejecuta localmente y envía datos de sesión multimedia y espectro de audio a NZXT-ESC mediante una conexión WebSocket local.

Úsalo para añadir:

- **Carátula del álbum** arte actual con controles de tamaño, borde y esquinas
- **Texto de reproducción** título, artista o álbum con desplazamiento para textos largos
- **Visualizador de audio** visuales personalizables de espectro y forma de onda en tiempo real

No está limitado a Spotify. La aplicación complementaria lee las sesiones multimedia de Windows compatibles y la salida de audio del sistema desde navegadores, reproductores multimedia y otras aplicaciones.

<a id="languages"></a>
## Idiomas

Actualmente, el editor es compatible con:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino`

**Documentación traducida:**
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

## Privacidad y almacenamiento local

NZXT-ESC está diseñado en torno al almacenamiento local del navegador:

- La configuración de los presets se guarda en **LocalStorage**.
- Las imágenes y los vídeos locales se guardan en **IndexedDB**.
- Las lecturas de sensores de NZXT CAM y los presets creados por el usuario no se envían a los sistemas de analítica.
- La aplicación no recopila intencionadamente información de identificación personal.

El sitio de producción utiliza **Google Tag Manager** y **Google Analytics 4** para analítica anónima del producto. **CookieYes** gestiona el consentimiento cuando es necesario, y las cookies analíticas opcionales se habilitan según las preferencias del usuario. Las compilaciones de desarrollo no requieren servicios de analítica de producción.

## Desarrollo

### Ejecutar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. El editor utiliza datos de hardware simulados cuando NZXT CAM no está disponible.

```bash
npm run build   # Comprobar tipos y crear una compilación de producción
npm test        # Ejecutar comprobaciones de i18n y la suite de Vitest
```

### Arquitectura

<details>
<summary><strong>Estructura del proyecto y principios de diseño</strong></summary>

```text
src/
├─ core/       Contratos de dominio de presets, capas, elementos y fondos
├─ render/     Motor compartido de preset a modelo de renderizado
├─ storage/    Estado de LocalStorage, importación/exportación y medios de IndexedDB
├─ platform/   Adaptadores de NZXT CAM y de la aplicación complementaria local
├─ sync/       Sincronización entre editor y tiempo de ejecución
├─ i18n/       Mensajes de idioma tipados y utilidades de traducción
└─ ui/
   ├─ config/  Editor de configuración con arrastrar y soltar
   ├─ kraken/  Tiempo de ejecución ligero para la pantalla Kraken
   └─ shared/  Componentes de interfaz reutilizables
```

La vista previa del editor y el tiempo de ejecución de Kraken utilizan la misma canalización de renderizado canónica. Este motor compartido mantiene coherentes el diseño, el estilo y las transformaciones entre lo que crea el usuario y lo que aparece en la pantalla física.

Los datos de los presets se normalizan antes de almacenarse, la importación y exportación están versionadas y las actualizaciones del editor se sincronizan mediante `BroadcastChannel`, con `localStorage` como alternativa.

</details>

### Contribuir

Las contribuciones y los pull requests concretos son bienvenidos. Antes de realizar cambios de arquitectura, lee:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Código de conducta](../CODE_OF_CONDUCT.md)
- [Política de seguridad](../SECURITY.md)

<a id="faq"></a>
## Preguntas frecuentes

<details>
<summary><strong>¿Necesito instalar NZXT-ESC?</strong></summary>

El editor principal no necesita una instalación independiente. Ábrelo mediante NZXT CAM Web Integration. Solo las capas de música opcionales requieren el cliente local NowPlaying.WebSocket para Windows.

</details>

<details>
<summary><strong>¿NZXT-ESC funciona sin NZXT CAM?</strong></summary>

El editor puede abrirse en un navegador normal y utiliza valores de sensores simulados para diseñar. La supervisión de hardware en tiempo real y la salida en la pantalla Kraken requieren NZXT CAM Web Integration.

</details>

<details>
<summary><strong>¿Qué modelos NZXT Kraken son compatibles?</strong></summary>

NZXT-ESC está diseñado para dispositivos NZXT Kraken compatibles con el modo de pantalla NZXT CAM Web Integration. El tamaño y la forma de pantalla disponibles se determinan mediante la API de NZXT CAM.

</details>

<details>
<summary><strong>¿Dónde se guardan los presets y los medios locales?</strong></summary>

Los presets se guardan en LocalStorage del navegador. Las imágenes y los vídeos locales se guardan en IndexedDB. Exporta periódicamente los presets importantes al cambiar de navegador, instalación de Windows u ordenador.

</details>

<details>
<summary><strong>¿La función de reproducción requiere Spotify?</strong></summary>

No. NowPlaying.WebSocket utiliza las sesiones multimedia de Windows compatibles y el audio del sistema, por lo que puede funcionar con navegadores y otras aplicaciones multimedia compatibles.

</details>

<details>
<summary><strong>¿Se pueden editar los presets de la comunidad?</strong></summary>

Sí. Los presets importados desde Explore son totalmente editables después de añadirlos a la Library.

</details>

<a id="license"></a>
## Licencia

NZXT-ESC se publica bajo una **Licencia de uso personal**.

**Permitido:** uso personal, modificaciones personales y redistribución con atribución clara al proyecto original.

**Uso comercial:** la venta, inclusión en paquetes, alquiler, integración en un producto de pago u otro uso monetizado requieren permiso previo por escrito del propietario del proyecto.
Consulta [LICENSE para conocer las condiciones completas](../LICENSE).

## Soporte y enlaces

- **Sitio web:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **Última versión:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Errores e ideas:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)
- **Aplicación complementaria:** [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket)

<div align="center">

Si NZXT-ESC mejoró tu configuración, puedes apoyar su desarrollo continuo:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Creado por **Gökhan AKGÜL (mRGogo)**, impulsado por café y horarios de sueño cuestionables.

</div>
