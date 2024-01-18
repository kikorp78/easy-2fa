import crypto from 'crypto';
import base32 from 'hi-base32';
import qr from 'qrcode';

/**
 * The options to use when generating a seed.
 */
interface GenerateSeedOptions {
  /**
   * The length of the seed to generate.
   * @default 48
   */
  length?: number;
}

/**
 * The options to use when generating a code.
 */
interface GenerateCodeOptions {
  /**
   * The length of the code to generate.
   * @default 6
   */
  length?: number;
}

/**
 * The options to use when verifying a TOTP code.
 */
interface VerifyTOTPOptions {
  /**
   * The length of the code to verify.
   * @default 6
   */
  length?: number;

  /**
   * The time interval in seconds for which a TOTP code is valid.
   * @default 30
   */
  step?: number;
}

/**
 * The options to use when verifying a HOTP code.
 */
interface VerifyHOTPOptions {
  /**
   * The length of the code to verify.
   * @default 6
   */
  length?: number;

  /**
   * The number of HOTP codes that can be checked before the current counter value.
   * @default 0
   */
  allowedBeforeDrift?: number;

  /**
   * The number of HOTP codes that can be checked after the current counter value.
   * @default 0
   */
  allowedAfterDrift?: number;
}

/**
 * The options to use when generating a URL.
 */
interface GenerateURLOptions {
  /**
   * The issuer of the 2FA.
   */
  issuer?: string;

  /**
   * The name of the user's account.
   */
  account?: string;
}

/**
 * The options to use when generating a QR code.
 */
interface GenerateQRCodeOptions {
  /**
   * The seed to generate the QR code from.
   */
  seed?: string;

  /**
   * The issuer of the 2FA.
   */
  issuer?: string;

  /**
   * The name of the user's account.
   */
  account?: string;

  /**
   * The URL to generate the QR code from.
   */
  url?: string;
}

/**
 * Generates a seed used for generating and checking the validity of 2FA codes.
 *
 * Do NOT share this publicly. This is a secret seed that should only be known by the user. Store it somewhere safe.
 *
 * @param [options] The options to use when generating the seed.
 * @returns A string representing the generated seed.
 */
const generateSeed = (options?: GenerateSeedOptions) => {
  const len = options?.length ?? 48;
  let seed = '';

  while (seed.length < len) {
    const buf = crypto.randomBytes(1);
    const newChar = buf.readUInt8(0) % 36;
    if (newChar < 10) seed += newChar;
    else seed += String.fromCharCode(newChar + 87);
    if (seed.length === len) break;
  }

  return seed;
};

/**
 * Generates a 2FA code from a seed.
 * @param seed The seed to generate the code from.
 * @param counter The counter to generate the code from.
 * @param [options] The options to use when generating the code.
 * @returns A number representing the generated code.
 */
const generateCode = (
  seed: string,
  counter: number,
  options?: GenerateCodeOptions
) => {
  const len = options?.length ?? 6;

  const hmac = crypto.createHmac('sha1', seed);

  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigInt64BE(BigInt(counter));

  const token = hmac.update(counterBuf).digest('hex');
  const tokenBuf = Buffer.from(token, 'hex');

  const offset = tokenBuf[19] & 0xf;
  const code =
    ((tokenBuf[offset] & 0x7f) << 24) |
    ((tokenBuf[offset + 1] & 0xff) << 16) |
    ((tokenBuf[offset + 2] & 0xff) << 8) |
    (tokenBuf[offset + 3] & 0xff);

  return parseInt(code.toString().slice(-len).padStart(len, '0'));
};

/**
 * Verifies a 2FA time-based (TOTP) code.
 * @param seed The seed to check against.
 * @param code The code to check.
 * @param [options] The options to use when verifying the code.
 * @returns A boolean representing the validity of the code.
 */
const verifyTOTP = (
  seed: string,
  code: number,
  options?: VerifyTOTPOptions
) => {
  const step = options?.step ?? 30;
  const counter = Math.floor(Date.now() / 1000 / step);

  return verifyHOTP(seed, code, counter, { length: options?.length });
};

/**
 * Verifies a 2FA hash-based (HOTP) code.
 * @param seed The seed to check against.
 * @param code The code to check.
 * @param counter The counter to check against.
 * @param [options] The options to use when verifying the code.
 * @returns A boolean representing the validity of the code.
 */
const verifyHOTP = (
  seed: string,
  code: number,
  counter: number,
  options?: VerifyHOTPOptions
) => {
  const before = options?.allowedBeforeDrift ?? 0;
  const after = options?.allowedAfterDrift ?? 0;

  for (let i = counter - before; i <= counter + after; i++) {
    if (generateCode(seed, i, { length: options?.length }) === code)
      return true;
  }
  return false;
};

/**
 * Generates a URL for a QR code that can be scanned into an authenticator app.
 * @param seed The seed to generate the URL from.
 * @param options The options to use when generating the URL.
 * @returns A string representing the generated URL.
 */
const generateURL = (seed: string, options?: GenerateURLOptions) => {
  const encodedSeed = base32.encode(seed).replace(/=/g, '');

  let url = 'otpauth://totp/';
  if (options?.issuer) {
    url += '?issuer=' + encodeURIComponent(options.issuer);
  }
  if (options?.account) {
    url += encodeURIComponent(options.account);
  }
  url += '&secret=' + encodeURIComponent(encodedSeed);

  return url;
};

/**
 * Generates a QR code from a seed/URL. Either can be provided.
 * @param options The options to use when generating the QR code.
 * @returns A string representing the generated QR code.
 */
const generateQRCode = async (options: GenerateQRCodeOptions) => {
  if (!options.seed && !options.url)
    throw new Error('You must provide either a seed or a URL.');

  if (options.url) return await qr.toDataURL(options.url);
  else
    return await qr.toDataURL(
      generateURL(options.seed!, {
        issuer: options.issuer,
        account: options.account
      })
    );
};

export {
  generateSeed,
  generateCode,
  verifyTOTP,
  verifyHOTP,
  generateURL,
  generateQRCode
};
