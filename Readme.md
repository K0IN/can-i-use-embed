# Can I Use Embed

Generate browser compatibility badges for your projects.

This service creates SVG badges showing which browsers support specific web features, using Mozilla's official browser compatibility data.

## What it does

Shows minimum browser versions required for web features you use in your project. Instead of manually checking compatibility tables, get a visual badge that updates automatically.

## Quick Start

Add this to your README to show Service Worker support:

```markdown
![Browser Support](https://can-i-use-embed.1k0.in/min-browser-version?features=api:navigator:serviceworker&filter=main)
```

Result:

![example-image](https://can-i-use-embed.1k0.in/min-browser-version?features=api:navigator:serviceworker&filter=main)

## Usage

There is a public instance of the service running at [can-i-use-embed.1k0.in](https://can-i-use-embed.1k0.in). You can use it to generate badges for your projects.
If you think your service will be used by many people, consider running your own instance to avoid rate limits.

### Basic syntax

```url
https://can-i-use-embed.1k0.in/min-browser-version?features=FEATURE_NAME&filter=FILTER
```

**Parameters:**

- `features` - Web feature identifier (e.g., `api:navigator:serviceworker`)
- `filter` - Target browsers: `main`, `desktop`, `mobile`, etc. (defaults to `all`)

**Multiple features:** Add multiple `&features=` parameters to check several features at once.

📋 [View all available features](https://can-i-use-embed.1k0.in/all-features)

### Multiple features

Check several features at once:

```url
https://can-i-use-embed.1k0.in/min-browser-version?features=api:navigator:serviceworker&features=api:indexeddb&features=api:webgl
```

### Browser filtering

Use `&filter=` to target specific browsers:

- `main` - Chrome, Firefox, Safari, Edge (recommended for most projects)
- `desktop` - Desktop browsers only
- `mobile` - Mobile browsers only (Chrome Android, Firefox Android, Safari iOS, Opera Mobile, WebViews, Samsung Internet)
- `chrome` - Chrome and Chrome Android
- `firefox` - Firefox and Firefox Android
- `safari` - Safari and Safari iOS
- `web` - Web browsers (includes all major browsers)
- `legacy` - Older browsers like IE, Node.js, etc.
- `chromium` - Chromium-based browsers (Chrome, Edge, Opera)
- `webview` - WebView browsers (Android, iOS)
- `standaloneEngines` - Standalone engines (Deno, Node.js)
- `vr` - VR browsers (Oculus)
- `all` - All browsers

## Examples

### Installable Progressive Web App

```markdown
![PWA Support](https://can-i-use-embed.1k0.in/min-browser-version?features=api:navigator:serviceworker&features=manifests:webapp:serviceworker&features=api:beforeinstallpromptevent&filter=main)
```

![PWA Support](https://can-i-use-embed.1k0.in/min-browser-version?features=api:navigator:serviceworker&features=manifests:webapp:serviceworker&features=api:beforeinstallpromptevent&filter=main)

### WebGL Application

```markdown
![WebGL Support](https://can-i-use-embed.1k0.in/min-browser-version?features=api:htmlcanvaselement:getcontext:webgl2_context&filter=main)
```

![WebGL Support](https://can-i-use-embed.1k0.in/min-browser-version?features=api:htmlcanvaselement:getcontext:webgl2_context&filter=main)

### Unsupported Feature (ambientlightsensor)

Note features behind flags are shown as unsupported

```markdown
![WebGL Support](https://can-i-use-embed.1k0.in/min-browser-version?features=api:ambientlightsensor&filter=main)
```

![WebGL Support](https://can-i-use-embed.1k0.in/min-browser-version?features=api:ambientlightsensor&filter=main)

### Multiple Features (serviceworker, indexeddb, webgl2renderingcontext, abortcontroller)

```markdown
![Multiple Features](https://can-i-use-embed.1k0.in/min-browser-version?features=api:navigator:serviceworker&features=api:indexeddb&features=api:webgl2renderingcontext&features=api:abortcontroller&filter=main)
```

![Multiple Features](https://can-i-use-embed.1k0.in/min-browser-version?features=api:navigator:serviceworker&features=api:indexeddb&features=api:webgl2renderingcontext&features=api:abortcontroller&filter=main)

## Deployment

Want to run your own instance?

```bash
# Clone and run locally
git clone https://github.com/K0IN/can-i-use-embed.git
cd can-i-use-embed

# Deploy to Deno Deploy
deno deploy main.ts
```

## API Endpoints

- `/min-browser-version` - renders the badge
- `/all-features` - Lists all available features (JSON)

## Credits

- Browser data: [MDN Browser Compat Data](https://github.com/mdn/browser-compat-data)
- Built with: [Deno](https://deno.land/) and [Hono](https://hono.dev/)
- Icons: [Font Awesome](https://fontawesome.com/)
