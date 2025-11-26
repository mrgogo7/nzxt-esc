> ⚠️ This document is an automatically translated version of the main English README.
> Technical terms, code blocks, filenames, and project terminology are intentionally kept in their original form.

# NZXT Elite Screen Customizer (NZXT-ESC) v5.11.261

Un editor moderno de medios y overlays basado en navegador para pantallas LCD NZXT Kraken Elite.

Crea fondos animados personalizados, overlays de métricas, capas de texto, líneas divisorias y diseños completamente personalizados — todo sincronizado en vivo dentro de NZXT CAM.

Gratis solo para uso personal — el uso comercial está estrictamente prohibido.

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
## 📋 CONTENIDO

- [🚀 Inicio Rápido](#-inicio-rápido)
  - [Método 1 — Inicio Directo (Recomendado)](#método-1--inicio-directo-recomendado)
  - [Método 2 — Instalación Manual (Dentro de NZXT CAM)](#método-2--instalación-manual-dentro-de-nzxt-cam)
  - [Recomendado: Renombrar la Tarjeta de Integración](#recomendado-renombrar-la-tarjeta-de-integración)
- [🎛 Usando el Editor (Botón Configurar)](#-usando-el-editor-botón-configurar)
- [💡 ¿Qué Hace Especial a NZXT-ESC?](#-qué-hace-especial-a-nzxt-esc)
  - [1. Experiencia de Edición Orientada al Diseño](#1-experiencia-de-edición-orientada-al-diseño)
  - [2. Motor de Overlay Completo Basado en Elementos](#2-motor-de-overlay-completo-basado-en-elementos)
  - [3. Sincronización LCD en Tiempo Real](#3-sincronización-lcd-en-tiempo-real)
  - [4. Motor de Medios Avanzado](#4-motor-de-medios-avanzado)
  - [5. Sistema de Presets (Acceso Temprano)](#5-sistema-de-presets-acceso-temprano)
- [🌍 Idiomas Soportados](#-idiomas-soportados)
- [🧪 Detalles Técnicos](#-detalles-técnicos)
- [🔧 Información para Desarrolladores](#-información-para-desarrolladores)
- [🕛 Historial de Versiones](#-historial-de-versiones)
- [🔗 Enlaces](#-enlaces)
- [📜 Licencia](#-licencia)

---
### 🚀 INICIO RÁPIDO

NZXT-ESC funciona DENTRO de NZXT CAM usando la función "Web Integration". Hay dos formas de instalarlo:

#### MÉTODO 1 — INICIO DIRECTO (RECOMENDADO)

1. Copia esto en la barra de direcciones de tu navegador:
   ```text
   nzxt-cam://action/load-web-integration?url=https://mrgogo7.github.io/nzxt-esc/
   ```
2. Presiona Enter.
3. Tu navegador mostrará una pregunta: "¿Abrir enlace nzxt-cam con NZXT CAM?" → Aprobar / Permitir
4. NZXT CAM se iniciará automáticamente.
5. Verás una ventana de confirmación: ¿Cargar Web Integration? ¿Estás seguro de que deseas cargar la siguiente integración web?
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
6. Presiona "Cargar".
7. Después de cargar, abre la tarjeta "Custom Web Integration".

#### MÉTODO 2 — INSTALACIÓN MANUAL (DENTRO DE NZXT CAM)

1. Abre NZXT CAM.
2. Ve a: Lighting → Kraken Elite V2 → LCD Display
3. Cambia el modo de visualización a: Web Integration
4. Encuentra la tarjeta llamada: Custom Web Integration
5. Haz clic en "Settings".
6. Ingresa la URL:
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
7. Presiona "Apply".
8. Luego presiona: Add as Card
9. Aparecerá una nueva tarjeta de Web Integration llamada "My Web Integration".
10. Selecciona "My Web Integration".
11. Presiona "Configure" para abrir el editor NZXT-ESC.

#### RECOMENDADO: RENOMBRAR LA TARJETA DE INTEGRACIÓN

NZXT CAM asigna el nombre predeterminado "My Web Integration". Para renombrar:
1. Selecciona "My Web Integration".
2. Presiona "Edit".
3. Cambia los campos a: Title:
   ```text
   Elite Screen Customizer
   ```
   Description:
   ```text
   NZXT Elite Screen Customizer (NZXT-ESC)
   ```
Esto ayuda a distinguir la integración de otras.

---
### 🎛 USANDO EL EDITOR (BOTÓN CONFIGURAR)

Toda la edición se realiza DENTRO de NZXT CAM a través del botón "Configure".

Dentro del editor puedes:

- Agregar / eliminar elementos de métricas, texto y divisores (hasta 20 elementos por overlay)
- Ajustar posición, rotación, escala, opacidad y color
- Elegir medios de fondo MP4 / GIF / PNG / JPG
- Usar archivos Local Media almacenados en el navegador a través de IndexedDB
- Gestionar presets (Import, Export, Duplicate, Delete, Rename, Apply)
- Usar plantillas de overlay preset (diseños Single, Dual, Triple, Quadruple InfoGraphic)
- Importar overlay presets con opciones Replace o Append
- Cambiar rápidamente entre presets favoritos a través del menú desplegable Quick Favorites
- Previsualizar todos los cambios en tiempo real en tu Kraken Elite LCD

Ya no se requiere URL externa o config.html.

---
### 💡 ¿QUÉ HACE ESPECIAL A NZXT-ESC?

NZXT-ESC no es un paquete de temas — es un **editor de diseño completo orientado al diseño** construido específicamente para el Kraken Elite LCD.

Ofrece libertad creativa completa mucho más allá de lo que NZXT CAM admite de forma nativa.

NZXT CAM **no permite**:
- Posicionamiento libre de elementos  
- Escalado o rotación de elementos  
- Overlays de texto personalizados  
- Colores transparentes  
- Fondos MP4  
- Fondos de YouTube  
- URLs de Pinterest  
- Combinaciones de medios mixtos + overlay  

NZXT-ESC **habilita todo esto**.

#### 1. EXPERIENCIA DE EDICIÓN ORIENTADA AL DISEÑO

- Colocación libre de arrastrar y soltar
- Rotación y escalado por elemento
- Manejadores de transformación alrededor de la vista previa LCD circular
- Ajustes micro con teclas de flecha
- Interfaz minimalista y sin distracciones
- Vista previa circular precisa que coincide con el hardware real

#### 2. MOTOR DE OVERLAY COMPLETO BASADO EN ELEMENTOS

Los modos Legacy Single/Dual/Triple se eliminaron por completo.

Ahora puedes agregar libremente:

- Elementos de métricas
- Elementos de texto
- Elementos divisores

Cada elemento admite:

- Posición X/Y
- Rotación
- Escala
- Color y opacidad
- Resaltado de selección

**Sistema de Overlay Preset**

Aplica rápidamente diseños preconfigurados usando el modal selector de plantillas. Elige entre plantillas Single, Dual, Triple o Quadruple InfoGraphic, cada una con posicionamiento y estilo optimizados. Las plantillas se pueden importar con modos Replace (sobrescribe elementos existentes) o Append (agrega a elementos existentes). Al agregar, los valores de zIndex se normalizan automáticamente para evitar conflictos de renderizado. El sistema admite hasta 20 elementos de overlay por configuración.

#### 3. SINCRONIZACIÓN LCD EN TIEMPO REAL

- Actualizaciones con throttle de ~100ms para estabilidad
- No se necesita actualización manual
- La pantalla LCD se actualiza instantáneamente mientras editas

#### 4. MOTOR DE MEDIOS AVANZADO

El motor de medios admite:

- Video MP4 (reproducción completa en LCD)
- Animaciones GIF
- Imágenes PNG / JPG
- Archivos Local Media (IndexedDB): Imágenes y videos de resolución completa cargados directamente desde tu computadora
- **URLs de Pinterest → resueltas automáticamente a medios directos**
- **URLs de YouTube (reproducción LCD)**


##### **🆕 Soporte de Local Media (NUEVO)**

NZXT-ESC ahora incluye un sistema integrado para cargar **imágenes o videos locales** directamente en el editor.  
Los archivos se almacenan de forma segura en **IndexedDB** y nunca salen de tu dispositivo.

Tipos de archivo admitidos:
- JPG / PNG / GIF  
- Video MP4  
- Tamaño máximo: **150 MB**

Características clave:
- Uso completamente offline — no se requiere hosting externo  
- Funciona con rotación, escala, fit/align y todas las herramientas de transformación  
- Sincronización LCD en tiempo real idéntica a medios remotos  
- Cada preset puede contener una referencia de medios locales  
- Los medios locales **no se incluyen** dentro de los archivos de preset exportados  
- Al importar, los presets que usaron medios locales mostrarán una advertencia y permitirán la reselección

Este sistema permite fondos verdaderamente offline y respetuosos con la privacidad mientras permanece 100% compatible con el motor de transformación del editor.


**Destacados de Integración de YouTube:**

- Los videos de YouTube **se reproducen en el LCD real** (se admite autoplay/mute/loop)
- La Vista previa del editor no puede reproducir videos de YouTube debido a las restricciones del reproductor integrado  
- En su lugar, se muestra un **placeholder rojo arrastrable**  
- Los usuarios pueden:
  - Posicionar el video de YouTube  
  - Escalar el video  
  - Aplicar configuraciones de align/fit  
  - Colocar cualquier elemento de overlay encima  
- El LCD siempre refleja el resultado final en tiempo real  
- Todas las herramientas de fondo estándar funcionan perfectamente con YouTube

Modos de ajuste:

- **Cover** — llena toda la pantalla  
- **Contain** — mantiene la relación de aspecto completa  
- **Fill** — estira para ajustar (opcional)  

Esto hace que NZXT-ESC sea el primer editor LCD completamente compatible con YouTube para NZXT CAM.

#### 5. SISTEMA DE PRESETS (ACCESO TEMPRANO)

Acciones disponibles:

- Import
- Export
- Delete
- Duplicate
- Rename
- Apply

Los presets almacenan el diseño completo como JSON.

**Importar/Exportar Overlay Preset**

Exporta tus configuraciones de elementos de overlay como archivos `.nzxt-esc-overlay-preset` para respaldo o compartir. Importa overlay presets con validación y manejo de errores. Al importar, elige el modo Replace para sobrescribir elementos existentes o el modo Append para agregar nuevos elementos mientras preservas los actuales. El sistema de importación incluye generación automática de ID para elementos de plantilla y normalización de zIndex para contenido agregado.

**Menú Desplegable Quick Favorites**

Al pasar el mouse sobre el botón Preset Manager, se revela un menú desplegable compacto que enumera hasta 10 presets favoritos (marcados con ★). Cada entrada muestra el nombre del preset, el estado de favorito y un indicador "activo" para el preset actualmente aplicado. Al seleccionar un elemento, se aplica inmediatamente ese preset usando la misma lógica de fusión atómica y guardado automático que el administrador completo. El menú desplegable presenta animaciones suaves de fade-in/fade-out e incluye un enlace directo para abrir la interfaz completa del Preset Manager. Esto proporciona un flujo de trabajo extremadamente rápido para usuarios que cambian frecuentemente entre un pequeño conjunto de presets preferidos.

##### **Local Media & Presets**
- Los archivos de preset exportados **no incluyen** el binario de medios locales  
- Importar un preset que previamente usó medios locales muestra una advertencia guiada  
- Los usuarios pueden volver a seleccionar el archivo a través del nuevo modal **Browse**  
- Todas las funciones de preset existentes (Apply, Duplicate, Rename, Delete) admiten completamente referencias de medios locales  
- Cambiar entre presets carga automáticamente los medios locales apropiados desde IndexedDB (si están disponibles)

---
### 🌍 IDIOMAS SOPORTADOS

NZXT-ESC admite múltiples idiomas para una experiencia de usuario localizada. Cambia entre idiomas usando el selector de idioma en el encabezado del editor.

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

Todas las traducciones se mantienen en un solo archivo TypeScript para facilitar la gestión y las actualizaciones.

---
### 🧪 DETALLES TÉCNICOS

- React 18
- TypeScript
- Vite bundler
- Sincronización LocalStorage + transmisión de eventos
- Motor de renderizado consciente de LCD circular
- Matemáticas de transformación AABB + rotación
- Sistema de overlay preset con generación de elementos basada en plantillas
- Asignación automática de ID y normalización de zIndex
- Soporte de UI multiidioma (English, Turkish, Spanish, German, Portuguese, French, Italian, Japanese)

---
### 🔧 INFORMACIÓN PARA DESARROLLADORES

Clonar e Instalar:

```bash
git clone https://github.com/mrgogo7/nzxt-esc
cd nzxt-esc
npm install
```

Iniciar Servidor de Desarrollo:

```bash
npm run dev
```

Exponer en LAN para pruebas de NZXT CAM:

```bash
npm run dev -- --host
```

Compilar:

```bash
npm run build
```

Vista previa de compilación:

```bash
npm run preview
```

**Contributing:**

- Abre un Issue antes de comenzar cambios importantes
- Mantén los PRs pequeños y enfocados
- Usa mensajes de commit claros
- Sigue la estructura del proyecto

---
### 🕛 HISTORIAL DE VERSIONES

#### 5.11.261 — Soporte de Local Media + Mejoras del Editor (NUEVO)

**Fecha de Lanzamiento:** 2025-11-26

##### 🆕 NUEVAS FUNCIONES
- **Fondos de Local Media (IndexedDB)**
  - Importa JPG, PNG, GIF o MP4 directamente desde tu computadora  
  - Archivos almacenados de forma segura a través de IndexedDB  
  - Funciona offline  
  - Compatible con todos los modos de transformación fit/scale/align  
  - Completamente sincronizado con el Kraken LCD en tiempo real  
  - El campo URL muestra `Local: filename.ext` en formato multilingüe  

##### 💡 Mejoras del Sistema de Presets
- Exportar presets que contienen medios locales activa una advertencia (medios no incluidos)  
- Importar tales presets muestra un mensaje de reselección  
- El cambio de preset carga automáticamente medios locales si están disponibles  

##### 🖥 MEJORAS DE UI
- Nuevo modal Browse para seleccionar medios locales  
- Soporte multilingüe completo para todos los mensajes de medios locales  
- Nuevo icono de botón + estilo actualizado  

##### 🧩 MEJORAS DE ESTABILIDAD
- Pipeline de resolución de medios mejorado  
- Revocación de Blob + limpieza para prevenir fugas  
- Mejor manejo de errores y cobertura i18n  

#### 5.11.26 — Renovación de Sincronización LCD Kraken en Tiempo Real y Mejoras de Estabilidad de Overlay

**Nota Adicional:**  
- Se introdujo **soporte de fondo de YouTube** (reproducción LCD) con alineación completa de posicionamiento/escala usando el nuevo sistema de Vista previa basado en placeholder.  
- Las matemáticas de transformación unificadas aseguran alineación proporcional Vista previa ↔ LCD.

#### 5.11.241 — Renovación de Sincronización LCD Kraken en Tiempo Real y Mejoras de Estabilidad de Overlay

**Fecha de Lanzamiento:** 2025-11-24

##### 🔧 Mejoras Importantes del Sistema

- **Renovación de Sincronización LCD Kraken en Tiempo Real**  
  La sincronización LCD en tiempo real no se introdujo recientemente, pero todo el sistema interno ha sido reconstruido. La implementación anterior dependía de ciclos de recarga de preset y causaba retrasos, actualizaciones perdidas y comportamientos de retroceso. La nueva arquitectura de sincronización entre pestañas basada en BroadcastChannel proporciona un flujo de actualización estable, de baja latencia y sincronizado con fotogramas.

##### 🛠 Mejoras

- **Mejoras de confiabilidad de renderizado de overlay**  
  Cuando el estado de overlay en tiempo de ejecución está vacío, el sistema ahora vuelve de forma segura a los datos de overlay de preset almacenados.

- **Actualización de estabilidad de fondo/medios**  
  Eliminado el retroceso de transformación en cambios de entrada.

- **Optimización del visor KrakenOverlay**  
  Ya no recarga presets; ahora escucha directamente los cambios en tiempo de ejecución para actualizaciones instantáneas.

##### 🐞 Correcciones de Errores

- Corregidas actualizaciones LCD retrasadas (anteriormente se actualizaban solo después del final del arrastre).

- Corregidos overlays faltantes en la vista Kraken después de actualizar.

- Corregidas advertencias de clave React duplicadas al agregar overlay presets.

- Corregidas configuraciones de medios/fondo que se revertían durante los ajustes.

##### ⚙ Cambios de Arquitectura

- Se introdujo un módulo dedicado `runtimeBroadcast.ts` para comunicación entre pestañas.

- Se agregó `setElementsForPresetSilent()` para actualizaciones seguras en tiempo de ejecución sin bucles de transmisión.

- Se actualizó `useOverlayConfig()` para manejar correctamente krakenMode + fallback de almacenamiento.

- Todas las fuentes de actualización de overlay se unificaron en una sola canalización impulsada por tiempo de ejecución.

##### 📁 Notas para Desarrolladores

- BroadcastChannel vuelve elegantemente si no es compatible.

- Las actualizaciones en tiempo de ejecución se clonan profundamente antes de la sincronización para evitar problemas de mutación.

- Esta versión reemplaza la antigua arquitectura de sincronización con una canalización moderna, estable y en tiempo real.

#### v5.11.24

- Paquete de Mejora de Calidad de Overlay y Preset Manager
- Nuevo Modal de Exportación de Overlay: Export ahora solicita un nombre de archivo usando un modal limpio (admite tecla ENTER)
- Nuevo Botón de Preset: Crea instantáneamente un preset vacío completamente nuevo con valores predeterminados
- UI de Preset Manager Mejorada: Botones de acción de preset reordenados: Delete → Favorite → Duplicate → Rename → Apply
- Gestión de Overlay Mejorada:
  - "Clear All Overlay Elements" ahora usa un modal de confirmación
  - La tecla Delete elimina el elemento seleccionado (con modal de confirmación)
  - Se agregó soporte de tooltip para todos los botones de eliminar
- Mejoras de Usabilidad de Modal Global: Todos los modales ahora admiten confirmación mediante tecla ENTER
- Corrección de Colisión de ID para Append de Overlay Preset: Problema de clave React duplicado completamente resuelto regenerando IDs de elementos en append
- Mejoras Generales de Estabilidad: Arquitectura de tiempo de ejecución preservada, reglas de autosave respetadas y todas las restricciones FAZ-9 permanecen intactas

#### v5.11.23

- Sistema de overlay preset con modal selector de plantillas
- Plantillas Single, Dual, Triple y Quadruple InfoGraphic
- Importación/exportación de overlay preset con modos Replace y Append
- Límite de elementos aumentado a 20 por overlay
- Normalización automática de zIndex para plantillas agregadas
- Generación de lista de plantillas dinámica a partir de definiciones de plantillas
- Notificaciones de error mejoradas para operaciones de importación/exportación
- Mejoras de posicionamiento de menú consciente del viewport

#### v5.11.21

- Motor de diseño basado en elementos
- Sistema de transformación de rotación y escala
- Resaltado de selección
- Movimiento con teclas de flecha
- Modos legacy eliminados
- Administrador de preset completo (Import/Export/Duplicate/Delete/Rename/Apply)
- Menú desplegable Quick Favorites para cambio instantáneo de preset
- Mejoras de UX y estabilidad

Ver GitHub Releases para versiones anteriores.

---
### 🔗 ENLACES

Repository: https://github.com/mrgogo7/nzxt-esc/

Support: [GitHub Sponsors](https://github.com/sponsors/mrgogo7) • [Patreon](https://www.patreon.com/mRGogo7) • [Buy Me a Coffee](https://www.buymeacoffee.com/mrgogo)

Issues:

https://github.com/mrgogo7/nzxt-esc/issues

---
### 📜 LICENCIA

Licencia de Uso Personal

**Permitido:** Uso personal • Modificaciones personales • Redistribución con crédito

**No Permitido:** Uso comercial • Venta, agrupación, alquiler o monetización en cualquier forma

NZXT-ESC es un proyecto impulsado por la comunidad y como hobby destinado solo para uso personal.

<details>
<summary><strong>📁 Índice Completo de Palabras Clave SEO (Haz clic para Expandir)</strong></summary>

**nzxt kraken elite lcd editor, nzxt cam customization, nzxt web integration custom, nzxt animated lcd background, mp4 lcd background nzxt, youtube kraken elite lcd, nzxt gif overlay, nzxt overlay editor, custom lcd screen nzxt, nzxt cam alternatives, nzxt cam limitations, kraken elite custom display, nzxt lcd text editor, nzxt lcd metrics overlay, nzxt lcd mods, nzxt pinterest background, nzxt lcd media engine, nzxt-esc project, nzxt cam modding, nzxt kraken elite youtube support, custom nzxt layouts, nzxt cam web integration presets, nzxt overlay templates, nzxt custom ui editor, nzxt lcd graphics editor, nzxt real-time lcd sync, kraken elite advanced customization, nzxt cam mp4 support, nzxt cam gif support, nzxt cam youtube embed, nzxt cam background editor**

</details>

