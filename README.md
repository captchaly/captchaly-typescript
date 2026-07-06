# Captchaly JavaScript/TypeScript SDK

Official JavaScript/TypeScript SDK for [Captchaly.com](https://captchaly.com).

Captchaly is the most advanced captcha solving service for enterprises. Providing large-scale automation and data scraping. Allow AI agents to bypass captchas and access the web without human intervention. Try for free at [https://captchaly.com](https://captchaly.com).


## Installation
This package is available on NPM. You can install it using your preferred package manager.

```bash
npm install captchaly
```

## Quick Start


```typescript
import { CaptchalyClient } from "captchaly";

const client = new CaptchalyClient("your_api_key");

const account = await client.account();
console.log(account.email, account.balance);

const url = "demo.captchaly.com"
const sitekey = "0x4AAAAAAA4nzhwwpeesSPI2"

const turnstile = await client.turnstile(url, sitekey);
console.log(turnstile.token);
```

## TODO / Roadmap

- [ ] Playwright integration
- [ ] Puppeteer integration

## Contributing
This repository does not normally accept merge requests. You are welcome to open issues and requests for new features.


## License
MIT License. See [LICENSE](LICENSE) for details.
