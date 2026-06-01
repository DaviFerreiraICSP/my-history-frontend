# Our History — Frontend

Interface web do explorador histórico imersivo **Our History**.

## Tecnologias

| Biblioteca | Função |
|---|---|
| React 19 + Vite | Framework e bundler |
| Leaflet + react-leaflet | Mapa interativo |
| react-leaflet-cluster | Agrupamento de pins |
| Framer Motion | Animações e transições |
| Lucide React | Ícones |
| simple-icons | SVG paths de logos de marcas |
| Axios | Requisições HTTP |
| CSS Vanilla | Estilização |

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz com:
   ```env
   VITE_API_URL=https://my-history-backend.vercel.app
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Scripts

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview do build local
npm run lint      # Lint
```

## Funcionalidades

- **Mapa interativo** com clustering de pins por proximidade
- **18 tipos de locais** com ícone e cor distintos (castelo, museu, igreja, teatro, etc.)
- **Narrativas por IA** geradas pelo backend (Google Gemini), exibidas em painel deslizante
- **3 temas**: claro, escuro e meia-noite
- **8 idiomas**: pt-BR, en, es-ES, fr-FR, de-DE, zh-CN, ja-JP, ru-RU
- **4 guias de IA**: historiador, explorador, poeta, filósofo
- **Filtro por tipo** de local no painel de configurações
- **Botões de navegação** com logos reais (Google Maps, Waze, Apple Maps)
- **Onboarding** estilo Instagram Stories com suporte a dark/light mode
- **Modal Sobre** com links do desenvolvedor e política de privacidade
- **Glassmorphism** consistente em todos os botões e painéis
- **Estado de erro** com botão de retry no carregamento de histórias
- **Otimizações mobile**: limite de 30 pins, animações de cluster desativadas, cache de ícones

## Estrutura de Pastas

```
src/
  assets/
    our_history_black.png    # Logo preta (modo claro)
    our_history_white.png    # Logo branca (modo escuro)
    googlemaps.svg           # Logo oficial Google Maps
    waze.svg                 # Logo oficial Waze (#33CCFF)
    applemaps.png            # Ícone iOS do Apple Maps
  components/
    MapComponent.jsx         # Mapa, pins, scan ripple, popups
    StoryPanel.jsx           # Painel de narrativa deslizante
    OnboardingOverlay.jsx    # Tutorial estilo Instagram Stories
    AboutModal.jsx           # Modal "Sobre o app"
    SearchBar.jsx            # Busca com geocoding Nominatim
    BrandIcons.jsx           # Componentes de logos das marcas de navegação
  App.jsx                    # Estado global, fetch Wikipedia, inferência de tipo
  i18n.js                    # Todas as traduções
  index.css                  # Estilos globais, glassmorphism e temas

public/
  favicon.ico
  privacy.html               # Política de privacidade
```

## Tipos de Locais e Cores

| Tipo | Cor | Ícone |
|------|-----|-------|
| castle / fort | `#7C3AED` violeta | Castle / Shield |
| museum | `#0891B2` ciano | Building2 |
| church | `#D97706` âmbar | Church |
| monument | `#F97316` laranja | MapPin |
| memorial | `#E879F9` rosa | Heart |
| ruins | `#B45309` marrom | Pickaxe |
| archaeological_site | `#A16207` terra | Map |
| battlefield | `#DC2626` vermelho | Swords |
| station | `#0284C7` azul | Train |
| district | `#16A34A` verde | Building |
| historical_landmark | `#6366F1` índigo | Landmark |
| university | `#0D9488` esmeralda | GraduationCap |
| bridge | `#64748B` ardósia | Milestone |
| theater | `#BE185D` rosa escuro | Drama |
| wonder | `#D97706` ouro | Crown |
| event_site | `#7C2D12` cobre | Flag |

## Design System

- **Glassmorphism**: `background: rgba(255,255,255,0.85)` + `backdrop-filter: blur(12-24px)` + `border: 1px solid rgba(0,0,0,0.08)` aplicado em todos os botões, pills e painéis
- **Tipografia**: Geist (títulos), Inter (UI), Crimson Pro (narrativas)
- **Acento**: `#8B5CF6` (violeta) com gradientes para `#EC4899`
- **Animações**: Framer Motion spring em todos os painéis; `whileHover rotate(90°)` + `whileTap scale(0.88)` nos botões X

## Deploy (Vercel)

Configurado via `vercel.json` com:
- Rewrite de todas as rotas para `index.html` (SPA)
- Redirect de `/favicon.svg` → `/logo-black.png` (cache bust)
- Headers de segurança: `X-Frame-Options`, `X-Content-Type-Options`, `HSTS`, `Permissions-Policy`

URL de produção: **https://historyfrontend.vercel.app**

Defina a variável de ambiente `VITE_API_URL` no painel da Vercel com a URL do backend.
