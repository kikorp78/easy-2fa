# Easy-2FA

Easy-2FA is a lightweight NPM package designed for effortless generation and verification of Two-Factor Authentication (2FA) codes with additional utilities. It supports both TOTP and HOTP.

Additional utilities include generating the `otpauth://` URL and generating a QR code.

# How to use

Firstly, install `easy-2fa` using your package manager:

```
npm install easy-2fa
yarn add easy-2fa
pnpm install easy-2fa
```

After installation, you can import the package in your project and start using it.

```ts
import tfa from 'easy-2fa';

// Generate a seed (keep this unique and stored somewhere safe)
const seed = tfa.generateSeed();
// => tj8kxt4sa6wuq6tucnda2h6gth76s80o04276hhjth89evbp

// Generate a QR code for the user to scan into the authenticator app
const qrCode = await tfa.generateQRCode({ seed });

// ...

// Once you receive a code from the user, verify it this way
tfa.verifyTOTP(seed, 961853);
// => true

tfa.verifyTOTP(seed, 0);
// => false
```

And that's it! For more information about the options, consult the API documentation below.

# API Reference

## `generateSeed()`

**Description**: Generates a seed used for generating and checking the validity of 2FA codes.

**Parameters**:

- `options?`: The options to use when generating the seed.
  - `length?`: The length of the seed to generate. Default is 48.

**Returns**: A string representing the generated seed.

**Example**:

```ts
const seed = tfa.generateSeed();
```

### Important note:

Do NOT share this publicly. This is a secret seed that should only be known by the user. Store it somewhere safe.

## `generateCode()`

**Description**: Generates a 2FA code from a seed.

**Parameters**:

- `seed`: The seed to generate the code from.
- `counter`: The counter to generate the code from.
- `options?`: The options to use when generating the code.
  - `length?`: The length of the code to generate. Default is 6.

**Returns**: A number representing the generated code.

**Example**:

```ts
const code = tfa.generateCode(seed);
```

## `verifyTOTP()`

**Description**: Verifies a 2FA time-based (TOTP) code.

**Parameters**:

- `seed`: The seed to check against.
- `code`: The code to check.
- `options?`: The options to use when verifying the code.
  - `length?`: The length of the code to verify. Default is 6.
  - `step?`: The time interval in seconds for which a TOTP code is valid. Default is 30.

**Returns**: A boolean representing the validity of the code.

**Example**:

```ts
const isValid = tfa.verifyTOTP(seed, 961853);
if (isValid) console.log('The code is valid!');
else console.log('The code is invalid!');
```

## `verifyHOTP()`

**Description**: Verifies a 2FA hash-based (HOTP) code.

**Parameters**:

- `seed`: The seed to check against.
- `code`: The code to check.
- `counter`: The counter to check against.
- `options?`: The options to use when verifying the code.
  - `length?`: The length of the code to verify. Default is 6.
  - `allowedBeforeDrift?`: The number of HOTP codes that can be checked before the current counter value. Default is 0.
  - `allowedAfterDrift?`: The number of HOTP codes that can be checked after the current counter value. Default is 0.

**Returns**: A boolean representing the validity of the code.

**Example**:

```ts
const isValid = tfa.verifyHOTP(seed, 961853, 0);
if (isValid) console.log('The code is valid!');
else console.log('The code is invalid!');
```

## `generateURL()`

**Description**: Generates a URL for a QR code that can be scanned into an authenticator app.

**Parameters**:

- `seed`: The seed to generate the URL from.
- `options?`: The options to use when generating the URL.
  - `issuer?`: The issuer of the 2FA.
  - `account?`: The name of the user's account.

**Returns**: A string representing the generated URL.

**Example**:

```ts
const url = tfa.generateURL(seed, {
  issuer: 'Discord',
  account: 'example@example.org'
});
```

## `generateQRCode()`

**Description**: Generates a QR code from a seed/URL. Either can be provided.

**Parameters**:

- `options?`: The options to use when generating the URL.
  - `seed?`: The seed to generate the QR code from.
  - `issuer?`: The issuer of the 2FA.
  - `account?`: The name of the user's account.
  - `url?`: The URL to generate the QR code from.

**Returns**: A string representing the generated QR code.

**Example**:

```ts
const qrCode = tfa.generateQRCode({
  seed: 'tj8kxt4sa6wuq6tucnda2h6gth76s80o04276hhjth89evbp'
});
```

# Bugs/Issues

If you find an issue or bugs in the code or need any help, please open an [issue](https://github.com/kikorp78/easy-2fa/issues) on the repository.

# Contribution

If you think that something can be improved or changed, feel free to open a [pull request](https://github.com/kikorp78/easy-2fa/pulls).

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
