import type { Account, Geetest, Hcaptcha, Recaptcha, Turnstile } from "./models.js";

export const VERSION = "0.1.0";

const BASE_URL = "https://v1.captchaly.com";
const USER_AGENT = `captchaly-ts/${VERSION}`;
const REQUEST_TIMEOUT = 180_000; // in milliseconds
const DEFAULT_RETRIES = 3;
const WARNING_HEADER = "X-Captchaly-Warning";

export class CaptchalyClient {
	constructor(private readonly apiKey: string) {}

	private async request<T>(path: string, options: RequestInit = {}, tries: number = DEFAULT_RETRIES): Promise<T> {
		const url = `${BASE_URL}${path}`;
		const headers = {
			"User-Agent": USER_AGENT,
			"X-Captchaly-UA": USER_AGENT, // useragent header is not configurable on browser
			Authorization: `Bearer ${this.apiKey}`,
			...options.headers,
		};

		for (let i = 1; i <= tries; i++) {
			const response = await fetch(url, { ...options, headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT) });
			if (response.status !== 503) {
				if (response.headers.has(WARNING_HEADER)) {
					console.warn(`Captchaly warning: ${response.headers.get(WARNING_HEADER)}`);
				}

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Request failed with status code ${response.status}: ${errorText}`);
				}

				return (await response.json()) as T;
			}
			console.info(`Unable to solve captcha, retrying... (${i}/${tries})`);
		}
		throw new Error(
			`Failed to get successful response after ${tries} attempts. Check your parameter or try again later. If the issue persists, please contact support.`,
		);
	}

	/**
	 * Get account information.
	 */
	async account() {
		return this.request<Account>("/account", undefined, 1);
	}

	/**
	 * Solve hCaptcha and return the captcha token (`h-captcha-response`) that to be submitted to the target website.
	 * @param url The URL where the captcha is located on, or you can only just use the full domain name of the website (must include any subdomain). Captchaly will not try to access this URL therefore it will not be a problem if the captcha is behind some authentications. Examples: `https://www.example.com/examplepath`, `example.com`, `subdomain.example.com`
	 * @param sitekey The value of the `data-sitekey` property of the captcha `div` element, or the value of the `sitekey` parameter of the requests from the webpage to the hCaptcha server. For example: `a5f74b19-9e45-40e0-b45d-47ff91b7a6c2`
	 * @param options.proxy The optional proxy used to solve the captcha. Must match the format `scheme://host:port`, or `scheme://username:password@host:port` if authentication is required. Examples: `http://john:my_password@myproxy.com:8080`, `http://123.123.123.123:8080`
	 * @param tries How many attempts until not receiving a 503 status code from Captchaly.
	 */
	async hcaptcha(url: string, sitekey: string, options?: { proxy?: string }, tries?: number) {
		const params = new URLSearchParams({ url, sitekey });
		if (options?.proxy) {
			params.append("proxy", options.proxy);
		}
		const path = `/hcaptcha?${params.toString()}`;
		return this.request<Hcaptcha>(path, undefined, tries);
	}

	/**
	 * Solve hCaptcha Enterprise and return the captcha token (`h-captcha-response`) that to be submitted to the target website.
	 * @param url The URL where the captcha is located on, or you can only just use the full domain name of the website (must include any subdomain). Captchaly will not try to access this URL therefore it will not be a problem if the captcha is behind some authentications. Examples: `https://www.example.com/examplepath`, `example.com`, `subdomain.example.com`
	 * @param sitekey The value of the `data-sitekey` property of the captcha `div` element, or the value of the `sitekey` parameter of the requests from the webpage to the hCaptcha server. For example: `a5f74b19-9e45-40e0-b45d-47ff91b7a6c2`
	 * @param options.rqdata The `rqdata` value required by some sites. Recommendation: Also providing the proxy argument when targeting these websites.
	 * @param options.proxy The optional proxy used to solve the captcha. Must match the format `scheme://host:port`, or `scheme://username:password@host:port` if authentication is required. Examples: `http://john:my_password@myproxy.com:8080`, `http://123.123.123.123:8080`
	 * @param tries How many attempts until not receiving a 503 status code from Captchaly.
	 */
	async hcaptchaEnterprise(url: string, sitekey: string, options?: { proxy?: string; rqdata?: string }, tries?: number) {
		const params = new URLSearchParams({ url, sitekey });
		if (options?.proxy) {
			params.append("proxy", options.proxy);
		}
		if (options?.rqdata) {
			params.append("rqdata", options.rqdata);
		}
		const path = `/hcaptcha-enterprise?${params.toString()}`;
		return this.request<Hcaptcha>(path, undefined, tries);
	}

	/**
	 * Solve reCAPTCHA v2 and return the captcha token (`g-recaptcha-response`) that to be submitted to the target website.
	 * @param url The URL where the captcha is located on, or you can only just use the full domain name of the website (must include any subdomain). Captchaly will not try to access this URL therefore it will not be a problem if the captcha is behind some authentications. Examples: `https://www.example.com/examplepath`, `example.com`, `subdomain.example.com`
	 * @param sitekey The value of the `data-sitekey` property of the captcha `div` element, or the value of the `sitekey` parameter of the requests from the webpage to the reCAPTCHA server. For example: `6Lc_aX0UAAAAABx0b0b0b0b0b0b0b0b0b0b0b0b0`
	 * @param tries How many attempts until not receiving a 503 status code from Captchaly.
	 */
	async recaptchaV2(url: string, sitekey: string, tries?: number) {
		const params = new URLSearchParams({ url, sitekey });
		const path = `/recaptchav2?${params.toString()}`;
		return this.request<Recaptcha>(path, undefined, tries);
	}

	/**
	 * Solve reCAPTCHA v3 and return the captcha token (`g-recaptcha-response`) that to be submitted to the target website.
	 * @param url The URL where the captcha is located on, or you can only just use the full domain name of the website (must include any subdomain). Captchaly will not try to access this URL therefore it will not be a problem if the captcha is behind some authentications. Examples: `https://www.example.com/examplepath`, `example.com`, `subdomain.example.com`
	 * @param sitekey The value of the `data-sitekey` property of the captcha `div` element, or the value of the `k` parameter of the requests from the webpage to the reCaptcha server. For example: `6LdKlZEpAAAAAAOQjzC2v_d36tWxCl6dWsozdSy9`
	 * @param action The value of the `data-action` property of the captcha `div` element, for example: `submit`
	 * @param options.fast Prioritize speed over quality. Recaptcha V3 works by determining how human-like a client is, when set to `true`, tokens are returned faster but with a lower human score (0.3 or lower). The default value is false (better score).
	 * @param tries How many attempts until not receiving a 503 status code from Captchaly.
	 */
	async recaptchaV3(url: string, sitekey: string, action: string, options?: { fast?: boolean }, tries?: number) {
		const params = new URLSearchParams({ url, sitekey, action });
		if (options?.fast) {
			params.append("fast", String(options.fast));
		}
		const path = `/recaptchav3?${params.toString()}`;
		return this.request<Recaptcha>(path, undefined, tries);
	}

	/**
	 * Solve Cloudflare Turnstile and return the captcha token (`cf-turnstile-response`) that to be submitted to the target website.
	 * @param url The URL where the captcha is located on, or you can use only the full domain name of the website (must include any subdomain). Captchaly will not try to access this URL therefore it will not be a problem if the captcha is behind some authentications. Examples: `https://www.example.com/examplepath`, `example.com`, `subdomain.example.com`
	 * @param sitekey The value of the `data-sitekey` property of the captcha `div` element, or the value of the `sitekey` argument of call to `turnstile.render()` or `turnstile.execute()`, typically prefixed with 0x, for example: `0x4AAAAAAAA-1LUipBaoBpsG`
	 * @param options.action The value of the `data-action` property of the captcha element, or the value of the `action` argument in the call to `turnstile.render()` or `turnstile.execute()`
	 * @param options.cdata The value of the `data-cdata` property of the captcha element, or the value of the `cData` argument in the call to `turnstile.render()` or `turnstile.execute()`
	 * @param tries How many attempts until not receiving a 503 status code from Captchaly.
	 */
	async turnstile(url: string, sitekey: string, options?: { action?: string; cdata?: string }, tries?: number) {
		const params = new URLSearchParams({ url, sitekey });
		if (options?.action) {
			params.append("action", options.action);
		}
		if (options?.cdata) {
			params.append("cdata", options.cdata);
		}
		const path = `/turnstile?${params.toString()}`;
		return this.request<Turnstile>(path, undefined, tries);
	}

	/**
	 * Solve GeeTest and return the captcha token that to be submitted to the target website.
	 * @param url The URL where the captcha is located on, or you can only just use the full domain name of the website (must include any subdomain). Captchaly will not try to access this URL therefore it will not be a problem if the captcha is behind some authentications. Examples: `https://www.example.com/examplepath`, `example.com`, `subdomain.example.com`
	 * @param captchaId The value of the `captcha_id` (or `captchaID`) parameter of the requests from the webpage to the Geetest server. For example: `e392e1d7fd421dc63325744d5a2b9c73`
	 * @param tries How many attempts until not receiving a 503 status code from Captchaly.
	 */
	async geetest(url: string, captchaId: string, tries?: number) {
		const params = new URLSearchParams({ url, captchaId });
		const path = `/geetest?${params.toString()}`;
		return this.request<Geetest>(path, undefined, tries);
	}
}
