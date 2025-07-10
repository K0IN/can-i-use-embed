# Can I Use Embed

Generate browser compatibility badges for your projects.

This service creates SVG badges showing which browsers support specific web features, using Mozilla's official browser compatibility data.

## What it does

Shows minimum browser versions required for web features you use in your project. Instead of manually checking compatibility tables, get a visual badge that updates automatically.

## Quick Start

Add this to your README to show Service Worker support:

```markdown
![Browser Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:navigator:serviceworker&filter=main)
```

Result:

![example-image](https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:navigator:serviceworker&filter=main)

## Usage

### Basic syntax

```url
https://can-i-use-embed-public.deno.dev/min-browser-version?features=FEATURE_NAME
```

Replace `FEATURE_NAME` with any web feature like `serviceworker`, etc.

To see a full list of available features, check the [API endpoint](https://can-i-use-embed-public.deno.dev/all-features).

### Multiple features

Check several features at once:

```url
https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:navigator:serviceworker&features=api:indexeddb&features=api:webgl
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

Example:

```url
https://can-i-use-embed-public.deno.dev/min-browser-version?features=webgl&filter=main
```

## Examples

### Installable Progressive Web App

```markdown
![PWA Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:navigator:serviceworker&features=manifests:webapp:serviceworker&features=api:beforeinstallpromptevent&filter=main)
```

![PWA Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:navigator:serviceworker&features=manifests:webapp:serviceworker&features=api:beforeinstallpromptevent&filter=main)

### WebGL Application

```markdown
![WebGL Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:htmlcanvaselement:getcontext:webgl2_context&filter=main)
```

![WebGL Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:htmlcanvaselement:getcontext:webgl2_context&filter=main)

### Unsupported Feature (ambientlightsensor)

Note features behind flags are shown as unsupported

```markdown
![WebGL Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:ambientlightsensor&filter=main)
```

![WebGL Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:ambientlightsensor&filter=main)

### Multiple Features (serviceworker, indexeddb, webgl2renderingcontext, abortcontroller)

```markdown
![Multiple Features](https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:navigator:serviceworker&features=api:indexeddb&features=api:webgl2renderingcontext&features=api:abortcontroller&filter=main)
```

![Multiple Features](https://can-i-use-embed-public.deno.dev/min-browser-version?features=api:navigator:serviceworker&features=api:indexeddb&features=api:webgl2renderingcontext&features=api:abortcontroller&filter=main)

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
