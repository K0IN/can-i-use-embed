# 🌐 Can I Use Embed

**Show browser compatibility for web features right in your README!**

This tool generates beautiful SVG badges that display which browsers support specific web features. Perfect for open source projects, documentation, and anywhere you need to quickly communicate browser compatibility.

## 🚀 What is this?

Ever wanted to show users which browsers support the cool web APIs your project uses? This service creates dynamic compatibility badges using Mozilla's official browser compatibility data. Just specify the features you're using, and get a clean, informative badge showing minimum browser versions.

## ✨ Quick Start

Want to show that your project uses Service Workers? Just add this to your README:

```markdown
![Browser Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=serviceworker&filter=main)
```

Result:
![example-image](https://can-i-use-embed-public.deno.dev/min-browser-version?features=serviceworker&filter=main)

## 🎯 How to Use

### Basic Usage

```url
https://can-i-use-embed-public.deno.dev/min-browser-version?features=FEATURE_NAME
```

Replace `FEATURE_NAME` with any web feature (like `serviceworker`, `webgl`, `css-grid`, etc.)

### Multiple Features

Check compatibility for multiple features at once:

```url
https://can-i-use-embed-public.deno.dev/min-browser-version?features=serviceworker&features=indexeddb&features=webgl
```

### Filter by Browser Types

Use `&filter=` to focus on specific browsers:

- `&filter=main` - Chrome, Firefox, Safari, Edge (most common)
- `&filter=desktop` - Desktop browsers only
- `&filter=mobile` - Mobile browsers only
- `&filter=chrome` - Chrome and Chrome Android
- `&filter=firefox` - Firefox and Firefox Android
- `&filter=safari` - Safari and Safari iOS

Example:

```url
https://can-i-use-embed-public.deno.dev/min-browser-version?features=webgl&filter=main
```

## 📋 Popular Features to Check

Here are some commonly used web features you might want to check:

| Feature | Description |
|---------|-------------|
| `serviceworker` | Service Worker API |
| `webgl` | WebGL graphics |
| `indexeddb` | IndexedDB storage |
| `css-grid` | CSS Grid Layout |
| `css-flexbox` | CSS Flexbox |
| `fetch` | Fetch API |
| `websockets` | WebSocket API |
| `webrtc` | WebRTC |
| `geolocation` | Geolocation API |
| `localStorage` | Local Storage |

## 🛠️ CLI Tool

For local development and automation, use the CLI tool:

```bash
# Show help
deno run --allow-read cli.ts --help

# List all available features
deno run --allow-read cli.ts --list

# Generate a badge for specific features
deno run --allow-read --allow-write cli.ts --features serviceworker --filter main --output badge.svg

# Check multiple features
deno run --allow-read --allow-write cli.ts --features serviceworker --features webgl --filter main
```

## 🎨 Examples in the Wild

### For a Progressive Web App

```markdown
![PWA Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=serviceworker&features=manifest&filter=main)
```

### For a WebGL Game

```markdown
![WebGL Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=webgl&features=webgl2&filter=main)
```

### For a Modern CSS Layout

```markdown
![CSS Support](https://can-i-use-embed-public.deno.dev/min-browser-version?features=css-grid&features=css-flexbox&filter=main)
```

## 🔧 Self-Hosting

Want to run your own instance? This is a Deno application:

```bash
# Clone the repository
git clone https://github.com/your-username/can-i-use-embed.git
cd can-i-use-embed

# Run locally
deno task dev

# Or deploy to Deno Deploy
deno deploy main.ts
```

## 📊 Available Endpoints

- `/min-browser-version` - Main badge endpoint
- `/all-features` - Lists all available features (JSON)

## 🤝 Contributing

Found a bug or want to add a feature? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - feel free to use this in your projects!

## 💡 Credits

- Browser compatibility data from [MDN Browser Compat Data](https://github.com/mdn/browser-compat-data)
- Built with [Deno](https://deno.land/) and [Hono](https://hono.dev/)
- Icons from [Font Awesome](https://fontawesome.com/)

---

Made with ❤️ for the web development community
