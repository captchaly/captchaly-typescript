import { beforeAll, describe, expect, it } from "vitest";
import { CaptchalyClient } from "../src/index";

describe("CaptchalyClient", () => {
	let captchaly: CaptchalyClient;

	beforeAll(() => {
		const apiKey = process.env["CAPTCHALY_APIKEY"];

		if (!apiKey) {
			throw new Error("CAPTCHALY_APIKEY is required to run integration tests");
		}

		captchaly = new CaptchalyClient(apiKey);
	});

	it.concurrent("account()", async () => {
		const account = await captchaly.account();

		expect(account).toBeTruthy();
		expect(account).toEqual(expect.any(Object));
		expect(account.id).toEqual(expect.any(String));
		expect(account.email).toEqual(expect.any(String));
		expect(account.balance).toEqual(expect.any(Number));
		expect(account.join_at).toEqual(expect.any(Number));
	});

	it.concurrent("hcaptcha()", async () => {
		const url = "hcaptcha.pythonanywhere.com";
		const sitekey = "87bd4111-b2d5-4f31-86c0-4a944f0d3b24";
		const hcaptcha = await captchaly.hcaptcha(url, sitekey);

		expect(hcaptcha).toBeTruthy();
		expect(hcaptcha).toEqual(expect.any(Object));
		expect(hcaptcha.token).toEqual(expect.any(String));
		expect(hcaptcha.duration).toEqual(expect.any(Number));
		expect(hcaptcha.time).toEqual(expect.any(Number));
		expect(hcaptcha.deducted).toEqual(expect.any(String));
		expect(!Number.isNaN(Number(hcaptcha.deducted))).toBe(true);
	});

	it.concurrent("hcaptchaEnterprise()", async () => {
		const url = "sso.acesso.gov.br";
		const sitekey = "93b08d40-d46c-400a-ba07-6f91cda815b9";
		const hcaptcha = await captchaly.hcaptchaEnterprise(url, sitekey);

		expect(hcaptcha).toBeTruthy();
		expect(hcaptcha).toEqual(expect.any(Object));
		expect(hcaptcha.token).toEqual(expect.any(String));
		expect(hcaptcha.duration).toEqual(expect.any(Number));
		expect(hcaptcha.time).toEqual(expect.any(Number));
		expect(hcaptcha.deducted).toEqual(expect.any(String));
		expect(!Number.isNaN(Number(hcaptcha.deducted))).toBe(true);
	});

	// TODO: test hcaptchaEnterprise() rqdata

	it.concurrent("recaptchaV2()", async () => {
		const url = "demo.captchaly.com";
		const sitekey = "6Le0FEMtAAAAAK9IgmSqaJfPb3E-9fI9xMp1nDfk";
		const recaptcha = await captchaly.recaptchaV2(url, sitekey);

		expect(recaptcha).toBeTruthy();
		expect(recaptcha).toEqual(expect.any(Object));
		expect(recaptcha.token).toEqual(expect.any(String));
		expect(recaptcha.duration).toEqual(expect.any(Number));
		expect(recaptcha.time).toEqual(expect.any(Number));
		expect(recaptcha.deducted).toEqual(expect.any(String));
		expect(!Number.isNaN(Number(recaptcha.deducted))).toBe(true);
	});

	it.concurrent("recaptchaV3()", async () => {
		const url = "demo.captchaly.com";
		const sitekey = "6LfPykItAAAAAD21EZu_BSQUUUVxnXrYEl3z8CwS";
		const action = "submit";
		const recaptcha = await captchaly.recaptchaV3(url, sitekey, action);

		expect(recaptcha).toBeTruthy();
		expect(recaptcha).toEqual(expect.any(Object));
		expect(recaptcha.token).toEqual(expect.any(String));
		expect(recaptcha.duration).toEqual(expect.any(Number));
		expect(recaptcha.time).toEqual(expect.any(Number));
		expect(recaptcha.deducted).toEqual(expect.any(String));
		expect(!Number.isNaN(Number(recaptcha.deducted))).toBe(true);
	});

	describe("turnstile()", () => {
		const url = "demo.captchaly.com";
		const sitekey = "0x4AAAAAAA4nzhwwpeesSPI2";

		it.concurrent("without options", async () => {
			const turnstile = await captchaly.turnstile(url, sitekey);

			expect(turnstile).toBeTruthy();
			expect(turnstile).toEqual(expect.any(Object));
			expect(turnstile.token).toEqual(expect.any(String));
			expect(turnstile.duration).toEqual(expect.any(Number));
			expect(turnstile.time).toEqual(expect.any(Number));
			expect(turnstile.deducted).toEqual(expect.any(String));
			expect(!Number.isNaN(Number(turnstile.deducted))).toBe(true);
		});

		it.concurrent("with action option", async () => {
			const action = "my-very-own-action";
			const turnstile = await captchaly.turnstile(url, sitekey, { action });

			expect(turnstile).toBeTruthy();
			expect(turnstile).toEqual(expect.any(Object));
			expect(turnstile.token).toEqual(expect.any(String));
			expect(turnstile.duration).toEqual(expect.any(Number));
			expect(turnstile.time).toEqual(expect.any(Number));
			expect(turnstile.deducted).toEqual(expect.any(String));
			expect(!Number.isNaN(Number(turnstile.deducted))).toBe(true);
		});

		it.concurrent("with cdata option", async () => {
			const cdata = "my-very-own-customer-data";
			const turnstile = await captchaly.turnstile(url, sitekey, { cdata });

			expect(turnstile).toBeTruthy();
			expect(turnstile).toEqual(expect.any(Object));
			expect(turnstile.token).toEqual(expect.any(String));
			expect(turnstile.duration).toEqual(expect.any(Number));
			expect(turnstile.time).toEqual(expect.any(Number));
			expect(turnstile.deducted).toEqual(expect.any(String));
			expect(!Number.isNaN(Number(turnstile.deducted))).toBe(true);
		});
	});

	it.concurrent("geetest()", async () => {
		const url = "2captcha.com";
		const captchaId = "e392e1d7fd421dc63325744d5a2b9c73";
		const geetest = await captchaly.geetest(url, captchaId);

		expect(geetest).toBeTruthy();
		expect(geetest).toEqual(expect.any(Object));
		expect(geetest.token).toEqual(expect.any(Object));
		expect(geetest.duration).toEqual(expect.any(Number));
		expect(geetest.time).toEqual(expect.any(Number));
		expect(geetest.deducted).toEqual(expect.any(String));
		expect(!Number.isNaN(Number(geetest.deducted))).toBe(true);
	});
});
