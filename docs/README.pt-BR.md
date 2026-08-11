# NZXT-ESC - A melhor NZXT Web Integration

### Editor avançado de layouts e personalização de tela para NZXT Kraken AIO

Crie layouts de LCD totalmente editáveis para o NZXT Kraken com sobreposições de sensores por arrastar e soltar, fontes personalizadas, imagens, GIFs, vídeos MP4, relógios, gráficos, dados de reprodução e visuais reativos ao som, renderizados ao vivo pelo **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-19-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Abrir no NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Abrir editor web](https://nzxt-esc.pages.dev/)
· [Modelos Kraken compatíveis](#supported-nzxt-kraken-lcd-models)
· [Recursos](#features)
· [Início rápido](#quick-start)
· [Perguntas frequentes](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Editor de layouts LCD NZXT Kraken com arrastar e soltar do NZXT-ESC"
       width="70%" />

> [!NOTE]
> **O NZXT-ESC é um projeto independente da comunidade.** Não é afiliado, patrocinado nem endossado pela NZXT.

Se o NZXT-ESC melhorou seu setup, você pode apoiar o desenvolvimento contínuo:

> [!IMPORTANT]
> ### Uso hospedado e acesso de apoiador
>
> A versão hospedada do NZXT-ESC pode ser usada por até **100 horas**
> antes que o Acesso de Apoiador seja necessário.
>
> O acesso hospedado contínuo após 100 horas está disponível para
> usuários que apoiam o projeto. Apoiadores recebem um Código de
> Acesso de Apoiador que remove o limite de uso de 100 horas.
>
> O apoio da comunidade ajuda a cobrir os custos de servidor, API,
> hospedagem, manutenção e desenvolvimento contínuo.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## Personalização do LCD NZXT Kraken sem layouts fixos

O NZXT-ESC transforma a tela do NZXT Kraken em uma área de criação livre. Monte uma tela LCD personalizada posicionando cada sensor, gráfico, relógio, imagem ou elemento de mídia exatamente onde desejar. Redimensione, gire, reordene, renomeie, bloqueie e estilize os elementos enquanto acompanha o resultado ser atualizado ao vivo pelo NZXT CAM.

O editor principal **não exige conta** nem **instalação separada para o usuário final**. Presets e mídias locais permanecem no armazenamento do navegador. As sobreposições opcionais de música usam o aplicativo complementar local para Windows [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="supported-nzxt-kraken-lcd-models"></a>

## Modelos NZXT Kraken LCD compatíveis

O NZXT-ESC é compatível com resfriadores líquidos AIO NZXT Kraken equipados com tela LCD e NZXT CAM Web Integration, incluindo os modelos atuais e de gerações anteriores das linhas Kraken Elite, Kraken Plus, Kraken e Kraken Z.

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

O NZXT-ESC adapta automaticamente o layout à resolução, ao tamanho e ao formato da tela do Kraken LCD informados pela API do NZXT CAM, permitindo que layouts personalizados, sobreposições de sensores, fundos animados, gráficos e mídias sejam renderizados pelo NZXT CAM Web Integration.

<a id="quick-start"></a>
## Início rápido

### Abrir diretamente no NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Clique em **Open NZXT-ESC in NZXT CAM**.
2. Permita que o navegador abra o NZXT CAM.
3. Confirme **Load Web Integration**.
4. Abra o novo cartão de Web Integration e selecione **Configure**.
5. Crie seu layout; as alterações serão sincronizadas com a tela Kraken.

<details>
<summary><strong>Configuração manual dentro do NZXT CAM</strong></summary>

1. Abra o **NZXT CAM**.
2. Acesse **Lighting → Kraken → LCD Display**.
3. Selecione **Web Integration**.
4. Abra as configurações de **Custom Web Integration**.
5. Digite:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Selecione **Apply** e depois **Add as Card**.
7. Abra o novo cartão e selecione **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Tela de configuração do NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Adicionar o NZXT-ESC como cartão do NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Veja em funcionamento

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Preset LCD personalizado para NZXT Kraken criado com o NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Layout animado para a tela NZXT Kraken no NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Sobreposição de sensores do NZXT CAM ao vivo em um LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Tela LCD Kraken animada e personalizada executada pelo NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Recursos

| Recurso | O que ele oferece |
|---|---|
| **Editor de layout livre** | Arraste, redimensione, gire, organize em camadas, bloqueie, renomeie e posicione cada elemento com precisão. |
| **Dados de sensores do NZXT CAM ao vivo** | Crie telas personalizadas para CPU, GPU, RAM, temperatura do líquido, energia, frequência e velocidade de ventoinhas. |
| **Gráficos avançados** | Combine gráficos radiais, lineares, circulares e históricos de sensores em um único layout. |
| **Fundos animados** | Use cores, gradientes, imagens locais, GIFs, vídeos MP4, URLs diretas de mídia e fontes do YouTube e Pinterest. |
| **Integração Now Playing** | Exiba capa do álbum, informações da faixa e visuais reativos ao som a partir de um cliente local do Windows. |
| **Explore e Library** | Importe presets da comunidade, edite cada parte, organize favoritos e mantenha sua própria coleção local. |
| **Armazenamento local em primeiro lugar** | Os presets usam LocalStorage; as mídias locais usam IndexedDB e permanecem no seu dispositivo. |
| **Editor multilíngue** | Use a interface em 18 idiomas compatíveis. |

### Elementos de sobreposição

O editor atual organiza os elementos de sobreposição em quatro categorias claras:

| Conteúdo | Dados | Tempo | Áudio |
|---|---|---|---|
| Texto | Sensor | Relógio digital | Capa do álbum |
| Forma | Gráfico radial | Relógio analógico | Texto de reprodução |
| Ícone | Gráfico linear | Data | Visualizador de áudio |
| Adesivo | Gráfico circular |  |  |
| Imagem | Gráfico de sensores |  |  |

Sempre que possível, todos os elementos usam o mesmo fluxo visual: selecione o elemento na prévia ou na lista de camadas e ajuste sua posição, tamanho, rotação, ordem, estilo e opções específicas do tipo.

### Monitoramento de hardware

Crie layouts ao vivo usando os dados de monitoramento disponíveis do NZXT CAM, incluindo:

`temperatura da CPU` · `carga da CPU` · `frequência da CPU` · `potência da CPU` · `velocidade da ventoinha da CPU` · `temperatura da GPU` · `carga da GPU` · `frequência da GPU` · `potência da GPU` · `velocidade da ventoinha da GPU` · `uso de RAM` · `temperatura do líquido`

Sistemas com várias GPUs podem selecionar automaticamente a GPU ativa ou usar uma GPU específica. O editor do navegador também fornece valores simulados quando a API do NZXT CAM não está disponível, permitindo continuar criando e visualizando layouts.

### Fundos e mídia

Use uma cor sólida ou um gradiente como base e adicione mídia de:

- Arquivos locais PNG, JPG, GIF, WebP ou MP4
- URLs diretas de imagem e vídeo
- Vídeos do YouTube
- Links de mídia do Pinterest

A mídia de fundo pode ser posicionada, redimensionada, ajustada e combinada com qualquer layout de sobreposição. Os arquivos locais são armazenados no IndexedDB e não são enviados pelo NZXT-ESC.

### Presets, Explore e Library

- Salve e organize até **20 presets personalizados** na Library local.
- Crie cada preset com até **40 elementos de sobreposição**.
- Importe e exporte arquivos de preset editáveis para backup ou compartilhamento.
- Explore layouts criados pela comunidade em **Explore**.
- Adicione um preset de Explore à Library, personalize-o e deixe-o do seu jeito.
- Mantenha a edição e a renderização do Kraken sincronizadas entre as duas visualizações do NZXT CAM.

## Now Playing e Visualizador de Áudio

O cliente opcional para Windows [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) é executado localmente e envia dados da sessão de mídia e do espectro de áudio ao NZXT-ESC por uma conexão WebSocket local.

Use-o para adicionar:

- **Capa do álbum** arte atual com controles de tamanho, borda e cantos
- **Texto de reprodução** título, artista ou álbum com rolagem para textos longos
- **Visualizador de áudio** visuais personalizáveis de espectro e forma de onda em tempo real

Não se limita ao Spotify. O aplicativo complementar lê sessões de mídia compatíveis do Windows e a saída de áudio do sistema de navegadores, players de mídia e outros aplicativos.

<a id="languages"></a>
## Idiomas

Atualmente, o editor oferece suporte a:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino` · `العربية`

**Documentação traduzida:**
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
[العربية](README.ar.md)

## Privacidade e armazenamento local

O NZXT-ESC foi projetado com base no armazenamento local do navegador:

- A configuração dos presets é armazenada no **LocalStorage**.
- Imagens e vídeos locais são armazenados no **IndexedDB**.
- Leituras de sensores do NZXT CAM e presets criados pelo usuário não são enviados para análise.
- O aplicativo não coleta intencionalmente informações de identificação pessoal.

O site de produção usa **Google Tag Manager** e **Google Analytics 4** para análises opcionais e anônimas do produto. O **CookieYes** gerencia o consentimento quando necessário, e os cookies do Google Analytics são ativados de acordo com as escolhas de consentimento do usuário.

O site publicado também usa o **Cloudflare Web Analytics**, ativado pelo Cloudflare Pages e funcionando de forma independente do Google Tag Manager. Ele fornece análises de tráfego e desempenho do site com foco em privacidade, sem usar cookies ou LocalStorage.

### Contribuição

Contribuições e pull requests focados são bem-vindos. Antes de fazer alterações arquiteturais, leia:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Código de Conduta](../CODE_OF_CONDUCT.md)
- [Política de Segurança](../SECURITY.md)

<a id="faq"></a>
## Perguntas frequentes

<details>
<summary><strong>Preciso instalar o NZXT-ESC?</strong></summary>

O editor principal não exige uma instalação separada. Abra-o pelo NZXT CAM Web Integration. Somente as sobreposições opcionais de música exigem o cliente local NowPlaying.WebSocket para Windows.

</details>

<details>
<summary><strong>O NZXT-ESC funciona sem o NZXT CAM?</strong></summary>

O editor pode ser aberto em um navegador comum e usa valores simulados de sensores para criação. O monitoramento de hardware ao vivo e a saída na tela Kraken exigem o NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Quais modelos NZXT Kraken são compatíveis?</strong></summary>

O NZXT-ESC é compatível com resfriadores com tela LCD das linhas **NZXT Kraken Elite, Kraken Plus, Kraken (2023) e Kraken Z** que oferecem o modo de exibição NZXT CAM Web Integration.

Veja a lista completa de [Modelos NZXT Kraken LCD compatíveis](#supported-nzxt-kraken-lcd-models).

</details>

<details>
<summary><strong>Onde os presets e as mídias locais são armazenados?</strong></summary>

Os presets são armazenados no LocalStorage do navegador. Imagens e vídeos locais são armazenados no IndexedDB. Exporte presets importantes regularmente ao mudar de navegador, instalação do Windows ou computador.

</details>

<details>
<summary><strong>O Now Playing exige Spotify?</strong></summary>

Não. O NowPlaying.WebSocket usa sessões de mídia compatíveis do Windows e o áudio do sistema, podendo funcionar com navegadores e outros aplicativos de mídia compatíveis.

</details>

<details>
<summary><strong>Os presets da comunidade podem ser editados?</strong></summary>

Sim. Presets importados de Explore são totalmente editáveis depois de adicionados à Library.

</details>

<details>
<summary><strong>Como funciona o limite de uso de 100 horas?</strong></summary>

A versão hospedada do NZXT-ESC pode ser usada por até 100 horas antes que o Acesso de Apoiador seja necessário.

Após o término desse período de uso, os usuários que apoiam o projeto recebem um Código de Acesso de Apoiador que remove o limite de uso de 100 horas.

Essa política de uso ajuda a cobrir os custos de servidor, API, hospedagem, manutenção e desenvolvimento contínuo, além de dar aos usuários bastante tempo para conhecer o projeto antes de decidir apoiá-lo.

O tempo de uso é contado enquanto o NZXT-ESC está em execução ativa na tela do Kraken.

</details>

<a id="license"></a>
## Licença

O NZXT-ESC é distribuído sob uma **Licença de Uso Pessoal**.

**Permitido:** uso pessoal, modificações pessoais e redistribuição com crédito claro ao projeto original.

**Uso comercial:** venda, inclusão em pacotes, aluguel, integração em produto pago ou qualquer outro uso monetizado exigem autorização prévia por escrito do proprietário do projeto.
Consulte [LICENSE para ver os termos completos](../LICENSE).

## Suporte e comunidade

- **Site:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **Versão mais recente:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Relatos de bugs e ideias:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

Siga o NZXT-ESC no YouTube e no Instagram para ver demonstrações, novos recursos, tutoriais, configurações da comunidade e novidades do projeto.

Se o NZXT-ESC melhorou seu setup, você pode apoiar o desenvolvimento contínuo:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Criado por **Gökhan AKGÜL (mRGogo)** - movido a café e horários de sono questionáveis.
