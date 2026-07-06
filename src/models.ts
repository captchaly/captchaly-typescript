/**
 * Account information.
 */
export interface Account {
	/** Unique account identifier. */
	id: string;
	/** Account email address. */
	email: string;
	/** Current account balance. */
	balance: number;
	/** Unix timestamp of account creation. */
	join_at: number;
}

/**
 * HCaptcha token solution.
 */
export interface Hcaptcha {
	/** How long until the token expires in seconds. */
	duration: number;
	/** Timestamp of when the token was generated. */
	time: number;
	/** The captcha token to be submitted to the target website, commonly for `h-captcha-response` but not always. */
	token: string;
	/** Amount deducted from account balance. */
	deducted: string;
}

/**
 * Google reCAPTCHA token solution.
 */
export interface Recaptcha {
	/** How long until the token expires in seconds. */
	duration: number;
	/** Timestamp of when the token was generated. */
	time: number;
	/** The captcha token to be submitted to the target website, commonly for `g-recaptcha-response` but not always. */
	token: string;
	/** Amount deducted from account balance. */
	deducted: string;
}

/**
 * Cloudflare Turnstile token solution.
 */
export interface Turnstile {
	/** How long until the token expires in seconds. */
	duration: number;
	/** Timestamp of when the token was generated. */
	time: number;
	/** The captcha token to be submitted to the target website, commonly for `cf-turnstile-response` but not always. */
	token: string;
	/** Amount deducted from account balance. */
	deducted: string;
}

interface GeetestToken extends Record<string, string> {
	captcha_id: string;
	lot_number: string;
	pass_token: string;
	gen_time: string;
	captcha_output: string;
}

/**
 * Geetest CAPTCHA token solution.
 */
export interface Geetest {
	/** How long until the token expires in seconds. */
	duration: number;
	/** Timestamp of when the token was generated. */
	time: number;
	/** The captcha object to be submitted to the target website. */
	token: GeetestToken;
	/** Amount deducted from account balance. */
	deducted: string;
}
