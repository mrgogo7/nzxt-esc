> ⚠️ This document is an automatically translated version of the main English README.
> Technical terms, code blocks, filenames, and project terminology are intentionally kept in their original form.

# NZXT Elite Screen Customizer (NZXT-ESC) v5.11.261

Um editor moderno de mídia e overlay baseado em navegador para telas LCD NZXT Kraken Elite.

Crie planos de fundo animados personalizados, overlays de métricas, camadas de texto, linhas divisórias e layouts totalmente personalizados — tudo sincronizado ao vivo dentro do NZXT CAM.

Gratuito apenas para uso pessoal — uso comercial é estritamente proibido.

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
## 📋 CONTEÚDO

- [🚀 Início Rápido](#-início-rápido)
  - [Método 1 — Inicialização Direta (Recomendado)](#método-1--inicialização-direta-recomendado)
  - [Método 2 — Instalação Manual (Dentro do NZXT CAM)](#método-2--instalação-manual-dentro-do-nzxt-cam)
  - [Recomendado: Renomear o Cartão de Integração](#recomendado-renomear-o-cartão-de-integração)
- [🎛 Usando o Editor (Botão Configurar)](#-usando-o-editor-botão-configurar)
- [💡 O Que Torna o NZXT-ESC Especial?](#-o-que-torna-o-nzxt-esc-especial)
  - [1. Experiência de Edição Orientada ao Design](#1-experiência-de-edição-orientada-ao-design)
  - [2. Motor de Overlay Completo Baseado em Elementos](#2-motor-de-overlay-completo-baseado-em-elementos)
  - [3. Sincronização LCD em Tempo Real](#3-sincronização-lcd-em-tempo-real)
  - [4. Motor de Mídia Avançado](#4-motor-de-mídia-avançado)
  - [5. Sistema de Presets (Acesso Antecipado)](#5-sistema-de-presets-acesso-antecipado)
- [🌍 Idiomas Suportados](#-idiomas-suportados)
- [🧪 Detalhes Técnicos](#-detalhes-técnicos)
- [🔧 Informações para Desenvolvedores](#-informações-para-desenvolvedores)
- [🕛 Histórico de Versões](#-histórico-de-versões)
- [🔗 Links](#-links)
- [📜 Licença](#-licença)

---
### 🚀 INÍCIO RÁPIDO

O NZXT-ESC funciona DENTRO do NZXT CAM usando o recurso "Web Integration". Existem duas formas de instalá-lo:

#### MÉTODO 1 — INICIALIZAÇÃO DIRETA (RECOMENDADO)

1. Copie isto na barra de endereços do seu navegador:
   ```text
   nzxt-cam://action/load-web-integration?url=https://mrgogo7.github.io/nzxt-esc/
   ```
2. Pressione Enter.
3. Seu navegador exibirá uma pergunta: "Abrir link nzxt-cam com NZXT CAM?" → Aprovar / Permitir
4. O NZXT CAM será iniciado automaticamente.
5. Você verá uma janela de confirmação: Carregar Web Integration? Tem certeza de que deseja carregar a seguinte integração web?
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
6. Pressione "Carregar".
7. Após o carregamento, abra o cartão "Custom Web Integration".

#### MÉTODO 2 — INSTALAÇÃO MANUAL (DENTRO DO NZXT CAM)

1. Abra o NZXT CAM.
2. Vá para: Lighting → Kraken Elite V2 → LCD Display
3. Altere o modo de exibição para: Web Integration
4. Encontre o cartão chamado: Custom Web Integration
5. Clique em "Settings".
6. Digite a URL:
   ```text
   https://mrgogo7.github.io/nzxt-esc/
   ```
7. Pressione "Apply".
8. Em seguida, pressione: Add as Card
9. Um novo cartão de Web Integration chamado "My Web Integration" aparecerá.
10. Selecione "My Web Integration".
11. Pressione "Configure" para abrir o editor NZXT-ESC.

#### RECOMENDADO: RENOMEAR O CARTÃO DE INTEGRAÇÃO

O NZXT CAM atribui o nome padrão "My Web Integration". Para renomear:
1. Selecione "My Web Integration".
2. Pressione "Edit".
3. Altere os campos para: Title:
   ```text
   Elite Screen Customizer
   ```
   Description:
   ```text
   NZXT Elite Screen Customizer (NZXT-ESC)
   ```
Isso ajuda a distinguir a integração de outras.

---
### 🎛 USANDO O EDITOR (BOTÃO CONFIGURAR)

Toda a edição é realizada DENTRO do NZXT CAM através do botão "Configure".

Dentro do editor você pode:

- Adicionar / remover elementos de métricas, texto e divisores (até 20 elementos por overlay)
- Ajustar posição, rotação, escala, opacidade e cor
- Escolher mídia de fundo MP4 / GIF / PNG / JPG
- Usar arquivos Local Media armazenados no navegador via IndexedDB
- Gerenciar presets (Import, Export, Duplicate, Delete, Rename, Apply)
- Usar modelos de overlay preset (layouts Single, Dual, Triple, Quadruple InfoGraphic)
- Importar overlay presets com opções Replace ou Append
- Alternar rapidamente entre presets favoritos através do menu suspenso Quick Favorites
- Visualizar todas as alterações em tempo real no seu Kraken Elite LCD

Não é mais necessária URL externa ou config.html.

---
### 💡 O QUE TORNA O NZXT-ESC ESPECIAL?

O NZXT-ESC não é um pacote de temas — é um **editor de layout completo orientado ao design** construído especificamente para o Kraken Elite LCD.

Oferece liberdade criativa completa muito além do que o NZXT CAM suporta nativamente.

O NZXT CAM **não permite**:
- Posicionamento livre de elementos  
- Escala ou rotação de elementos  
- Overlays de texto personalizados  
- Cores transparentes  
- Fundos MP4  
- Fundos do YouTube  
- URLs do Pinterest  
- Combinações de mídia mista + overlay  

O NZXT-ESC **habilita tudo isso**.

#### 1. EXPERIÊNCIA DE EDIÇÃO ORIENTADA AO DESIGN

- Posicionamento livre de arrastar e soltar
- Rotação e escala por elemento
- Alças de transformação ao redor da visualização prévia LCD circular
- Ajustes micro com teclas de seta
- Interface minimalista e sem distrações
- Visualização prévia circular precisa que corresponde ao hardware real

#### 2. MOTOR DE OVERLAY COMPLETO BASEADO EM ELEMENTOS

Os modos Legacy Single/Dual/Triple foram completamente removidos.

Agora você pode adicionar livremente:

- Elementos de métricas
- Elementos de texto
- Elementos divisores

Cada elemento suporta:

- Posição X/Y
- Rotação
- Escala
- Cor e opacidade
- Destaque de seleção

**Sistema de Overlay Preset**

Aplique rapidamente layouts pré-configurados usando o modal seletor de modelos. Escolha entre modelos Single, Dual, Triple ou Quadruple InfoGraphic, cada um com posicionamento e estilo otimizados. Os modelos podem ser importados com modos Replace (substitui elementos existentes) ou Append (adiciona a elementos existentes). Ao anexar, os valores de zIndex são normalizados automaticamente para evitar conflitos de renderização. O sistema suporta até 20 elementos de overlay por configuração.

#### 3. SINCRONIZAÇÃO LCD EM TEMPO REAL

- Atualizações com throttle de ~100ms para estabilidade
- Não é necessária atualização manual
- A tela LCD é atualizada instantaneamente enquanto você edita

#### 4. MOTOR DE MÍDIA AVANÇADO

O motor de mídia suporta:

- Vídeo MP4 (reprodução completa no LCD)
- Animações GIF
- Imagens PNG / JPG
- Arquivos Local Media (IndexedDB): Imagens e vídeos em resolução completa carregados diretamente do seu computador
- **URLs do Pinterest → resolvidas automaticamente para mídia direta**
- **URLs do YouTube (reprodução LCD)**


##### **🆕 Suporte a Local Media (NOVO)**

O NZXT-ESC agora inclui um sistema integrado para carregar **imagens ou vídeos locais** diretamente no editor.  
Os arquivos são armazenados com segurança no **IndexedDB** e nunca saem do seu dispositivo.

Tipos de arquivo suportados:
- JPG / PNG / GIF  
- Vídeo MP4  
- Tamanho máximo: **150 MB**

Recursos principais:
- Uso totalmente offline — não é necessário hospedagem externa  
- Funciona com rotação, escala, fit/align e todas as ferramentas de transformação  
- Sincronização LCD em tempo real idêntica à mídia remota  
- Cada preset pode conter uma referência de mídia local  
- A mídia local **não está incluída** dentro dos arquivos de preset exportados  
- Ao importar, presets que usaram mídia local exibirão um aviso e permitirão re-seleção

Este sistema permite planos de fundo verdadeiramente offline e amigáveis à privacidade, permanecendo 100% compatível com o motor de transformação do editor.


**Destaques da Integração do YouTube:**

- Os vídeos do YouTube **reproduzem no LCD real** (autoplay/mute/loop suportados)
- A Visualização prévia do editor não pode reproduzir vídeos do YouTube devido a restrições do player incorporado  
- Em vez disso, um **placeholder vermelho arrastável** é exibido  
- Os usuários podem:
  - Posicionar o vídeo do YouTube  
  - Escalar o vídeo  
  - Aplicar configurações de align/fit  
  - Colocar qualquer elemento de overlay em cima  
- O LCD sempre reflete o resultado final em tempo real  
- Todas as ferramentas de fundo padrão funcionam perfeitamente com o YouTube

Modos de ajuste:

- **Cover** — preenche toda a tela  
- **Contain** — mantém a proporção completa  
- **Fill** — estica para ajustar (opcional)  

Isso torna o NZXT-ESC o primeiro editor LCD totalmente compatível com YouTube para o NZXT CAM.

#### 5. SISTEMA DE PRESETS (ACESSO ANTECIPADO)

Ações disponíveis:

- Import
- Export
- Delete
- Duplicate
- Rename
- Apply

Os presets armazenam o layout completo como JSON.

**Importar/Exportar Overlay Preset**

Exporte suas configurações de elementos de overlay como arquivos `.nzxt-esc-overlay-preset` para backup ou compartilhamento. Importe overlay presets com validação e tratamento de erros. Ao importar, escolha o modo Replace para substituir elementos existentes ou o modo Append para adicionar novos elementos preservando os atuais. O sistema de importação inclui geração automática de ID para elementos de modelo e normalização de zIndex para conteúdo anexado.

**Menu Suspenso Quick Favorites**

Ao passar o mouse sobre o botão Preset Manager, um menu suspenso compacto é revelado listando até 10 presets favoritos (marcados com ★). Cada entrada exibe o nome do preset, o status de favorito e um indicador "ativo" para o preset atualmente aplicado. Ao selecionar um item, esse preset é aplicado imediatamente usando a mesma lógica de mesclagem atômica e salvamento automático do gerenciador completo. O menu suspenso apresenta animações suaves de fade-in/fade-out e inclui um link direto para abrir a interface completa do Preset Manager. Isso fornece um fluxo de trabalho extremamente rápido para usuários que alternam frequentemente entre um pequeno conjunto de presets preferidos.

##### **Local Media & Presets**
- Os arquivos de preset exportados **não incluem** o binário de mídia local  
- Importar um preset que anteriormente usou mídia local exibe um aviso guiado  
- Os usuários podem re-selecionar o arquivo através do novo modal **Browse**  
- Todas as funções de preset existentes (Apply, Duplicate, Rename, Delete) suportam completamente referências de mídia local  
- Alternar entre presets carrega automaticamente a mídia local apropriada do IndexedDB (se disponível)

---
### 🌍 IDIOMAS SUPORTADOS

O NZXT-ESC suporta vários idiomas para uma experiência de usuário localizada. Alterne entre idiomas usando o seletor de idioma no cabeçalho do editor.

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

Todas as traduções são mantidas em um único arquivo TypeScript para fácil gerenciamento e atualizações.

---
### 🧪 DETALHES TÉCNICOS

- React 18
- TypeScript
- Vite bundler
- Sincronização LocalStorage + transmissão de eventos
- Motor de renderização consciente de LCD circular
- Matemática de transformação AABB + rotação
- Sistema de overlay preset com geração de elementos baseada em modelos
- Atribuição automática de ID e normalização de zIndex
- Suporte de UI multilíngue (English, Turkish, Spanish, German, Portuguese, French, Italian, Japanese)

---
### 🔧 INFORMAÇÕES PARA DESENVOLVEDORES

Clonar e Instalar:

```bash
git clone https://github.com/mrgogo7/nzxt-esc
cd nzxt-esc
npm install
```

Iniciar Servidor de Desenvolvimento:

```bash
npm run dev
```

Expor na LAN para testes do NZXT CAM:

```bash
npm run dev -- --host
```

Compilar:

```bash
npm run build
```

Visualizar compilação:

```bash
npm run preview
```

**Contributing:**

- Abra uma Issue antes de iniciar mudanças importantes
- Mantenha os PRs pequenos e focados
- Use mensagens de commit claras
- Siga a estrutura do projeto

---
### 🕛 HISTÓRICO DE VERSÕES

#### 5.11.261 — Suporte a Local Media + Melhorias do Editor (NOVO)

**Data de Lançamento:** 2025-11-26

##### 🆕 NOVAS FUNCIONALIDADES
- **Planos de Fundo Local Media (IndexedDB)**
  - Importe JPG, PNG, GIF ou MP4 diretamente do seu computador  
  - Arquivos armazenados com segurança via IndexedDB  
  - Funciona offline  
  - Compatível com todos os modos de transformação fit/scale/align  
  - Completamente sincronizado com o Kraken LCD em tempo real  
  - O campo URL exibe `Local: filename.ext` em formato multilíngue  

##### 💡 Melhorias do Sistema de Presets
- Exportar presets contendo mídia local aciona um aviso (mídia não incluída)  
- Importar tais presets exibe uma mensagem de re-seleção  
- A alternância de preset carrega automaticamente mídia local se disponível  

##### 🖥 MELHORIAS DE UI
- Novo modal Browse para selecionar mídia local  
- Suporte multilíngue completo para todas as mensagens de mídia local  
- Novo ícone de botão + estilo atualizado  

##### 🧩 MELHORIAS DE ESTABILIDADE
- Pipeline de resolução de mídia melhorado  
- Revogação de Blob + limpeza para prevenir vazamentos  
- Melhor tratamento de erros e cobertura i18n  

#### 5.11.26 — Reformulação de Sincronização LCD Kraken em Tempo Real e Melhorias de Estabilidade de Overlay

**Nota Adicional:**  
- **Suporte a plano de fundo do YouTube** (reprodução LCD) introduzido com alinhamento completo de posicionamento/escala usando o novo sistema de Visualização prévia baseado em placeholder.  
- Matemática de transformação unificada garante alinhamento proporcional Visualização prévia ↔ LCD.

#### 5.11.241 — Reformulação de Sincronização LCD Kraken em Tempo Real e Melhorias de Estabilidade de Overlay

**Data de Lançamento:** 2025-11-24

##### 🔧 Melhorias Importantes do Sistema

- **Reformulação de Sincronização LCD Kraken em Tempo Real**  
  A sincronização LCD em tempo real não foi introduzida recentemente, mas todo o sistema interno foi reconstruído. A implementação anterior dependia de ciclos de recarregamento de preset e causava atrasos, atualizações perdidas e comportamentos de retorno. A nova arquitetura de sincronização entre abas baseada em BroadcastChannel fornece um fluxo de atualização estável, de baixa latência e sincronizado com quadros.

##### 🛠 Melhorias

- **Melhorias de confiabilidade de renderização de overlay**  
  Quando o estado de overlay em tempo de execução está vazio, o sistema agora retorna com segurança aos dados de overlay de preset armazenados.

- **Atualização de estabilidade de fundo/mídia**  
  Removido o retorno de transformação em mudanças de entrada.

- **Otimização do visualizador KrakenOverlay**  
  Não recarrega mais presets; agora ouve diretamente as mudanças em tempo de execução para atualizações instantâneas.

##### 🐞 Correções de Bugs

- Corrigidas atualizações LCD atrasadas (anteriormente atualizadas apenas após o fim do arrasto).

- Corrigidos overlays ausentes na visualização Kraken após atualização.

- Corrigidos avisos de chave React duplicados ao anexar overlay presets.

- Corrigidas configurações de mídia/fundo que revertiam durante ajustes.

##### ⚙ Mudanças de Arquitetura

- Módulo dedicado `runtimeBroadcast.ts` introduzido para comunicação entre abas.

- `setElementsForPresetSilent()` adicionado para atualizações seguras em tempo de execução sem loops de transmissão.

- `useOverlayConfig()` atualizado para lidar adequadamente com krakenMode + fallback de armazenamento.

- Todas as fontes de atualização de overlay unificadas em um único pipeline orientado por tempo de execução.

##### 📁 Notas para Desenvolvedores

- BroadcastChannel retorna elegantemente se não suportado.

- Atualizações em tempo de execução são clonadas profundamente antes da sincronização para evitar problemas de mutação.

- Esta versão substitui a antiga arquitetura de sincronização por um pipeline moderno, estável e em tempo real.

#### v5.11.24

- Pacote de Melhoria de Qualidade de Overlay e Preset Manager
- Novo Modal de Exportação de Overlay: Export agora solicita um nome de arquivo usando um modal limpo (suporta tecla ENTER)
- Novo Botão de Preset: Cria instantaneamente um preset vazio completamente novo com valores padrão
- UI de Preset Manager Melhorada: Botões de ação de preset reordenados: Delete → Favorite → Duplicate → Rename → Apply
- Gerenciamento de Overlay Melhorado:
  - "Clear All Overlay Elements" agora usa um modal de confirmação
  - A tecla Delete remove o elemento selecionado (com modal de confirmação)
  - Suporte de tooltip adicionado para todos os botões de excluir
- Melhorias de Usabilidade de Modal Global: Todos os modais agora suportam confirmação via tecla ENTER
- Correção de Colisão de ID para Append de Overlay Preset: Problema de chave React duplicado completamente resolvido regenerando IDs de elementos em append
- Melhorias Gerais de Estabilidade: Arquitetura de tempo de execução preservada, regras de autosave respeitadas e todas as restrições FAZ-9 permanecem intactas

#### v5.11.23

- Sistema de overlay preset com modal seletor de modelos
- Modelos Single, Dual, Triple e Quadruple InfoGraphic
- Importação/exportação de overlay preset com modos Replace e Append
- Limite de elementos aumentado para 20 por overlay
- Normalização automática de zIndex para modelos anexados
- Geração de lista de modelos dinâmica a partir de definições de modelos
- Notificações de erro aprimoradas para operações de importação/exportação
- Melhorias de posicionamento de menu consciente da viewport

#### v5.11.21

- Motor de layout baseado em elementos
- Sistema de transformação de rotação e escala
- Destaque de seleção
- Movimento com teclas de seta
- Modos legacy removidos
- Gerenciador de preset completo (Import/Export/Duplicate/Delete/Rename/Apply)
- Menu suspenso Quick Favorites para alternância instantânea de preset
- Melhorias de UX e estabilidade

Veja GitHub Releases para versões anteriores.

---
### 🔗 LINKS

Repository: https://github.com/mrgogo7/nzxt-esc/

Support: [GitHub Sponsors](https://github.com/sponsors/mrgogo7) • [Patreon](https://www.patreon.com/mRGogo7) • [Buy Me a Coffee](https://www.buymeacoffee.com/mrgogo)

Issues:

https://github.com/mrgogo7/nzxt-esc/issues

---
### 📜 LICENÇA

Licença de Uso Pessoal

**Permitido:** Uso pessoal • Modificações pessoais • Redistribuição com crédito

**Não Permitido:** Uso comercial • Venda, agrupamento, aluguel ou monetização de qualquer forma

O NZXT-ESC é um projeto de hobby e orientado pela comunidade destinado apenas para uso pessoal.

<details>
<summary><strong>📁 Índice Completo de Palavras-chave SEO (Clique para Expandir)</strong></summary>

**nzxt kraken elite lcd editor, nzxt cam customization, nzxt web integration custom, nzxt animated lcd background, mp4 lcd background nzxt, youtube kraken elite lcd, nzxt gif overlay, nzxt overlay editor, custom lcd screen nzxt, nzxt cam alternatives, nzxt cam limitations, kraken elite custom display, nzxt lcd text editor, nzxt lcd metrics overlay, nzxt lcd mods, nzxt pinterest background, nzxt lcd media engine, nzxt-esc project, nzxt cam modding, nzxt kraken elite youtube support, custom nzxt layouts, nzxt cam web integration presets, nzxt overlay templates, nzxt custom ui editor, nzxt lcd graphics editor, nzxt real-time lcd sync, kraken elite advanced customization, nzxt cam mp4 support, nzxt cam gif support, nzxt cam youtube embed, nzxt cam background editor**

</details>

