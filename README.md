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
| Axios | Requisições HTTP |
| CSS Vanilla | Estilização |

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz com:
   ```env
   VITE_API_URL=http://localhost:3000
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
- **18 tipos de Localis** com ícone e cor distintos (castelo, museu, igreja, teatro, etc.)
- **Narrativas por IA** geradas pelo backend (Google Gemini), exibidas em painel deslizante
- **3 temas**: claro, escuro e meia-noite (estilo Waze)
- **8 idiomas**: pt-BR, en, es-ES, fr-FR, de-DE, zh-CN, ja-JP, ru-RU
- **4 guias de IA**: historiador, explorador, poeta, filósofo
- **Filtro por tipo** de Locali no painel de configurações
- **Onboarding** em 3 slides com localStorage (não repete após conclusão)
- **Modal Sobre** com links do desenvolvedor e política de privacidade
- **Estado de erro** com botão de retry no carregamento de histórias
- **Otimizações mobile**: limite de 30 pins, animações de cluster desativadas, cache de ícones

## Estrutura de Pastas

```
src/
  assets/          # Logos (logo-black.png, logo-white.png)
  components/
    MapComponent.jsx     # Mapa, pins, scan ripple, popups
    StoryPanel.jsx       # Painel de narrativa
    OnboardingOverlay.jsx
    AboutModal.jsx
    SearchBar.jsx
  App.jsx          # Estado global, fetch Wikipedia, inferência de tipo
  i18n.js          # Todas as traduções
  index.css        # Estilos globais e temas

public/
  favicon.ico
  privacy.html     # Política de privacidade
```

## Deploy (Vercel)

Configurado via `vercel.json` com:
- Rewrite de todas as rotas para `index.html` (SPA)
- Headers de segurança: `X-Frame-Options`, `X-Content-Type-Options`, `HSTS`, `Permissions-Policy`

Defina a variável de ambiente `VITE_API_URL` com a URL do backend no painel da Vercel.
