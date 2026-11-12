# Android App Links: assetlinks.json

`public/.well-known/assetlinks.json` is served as a static file at
`https://www.soulmates.quest/.well-known/assetlinks.json` (200, `application/json`, no redirect).
`src/proxy.ts` and `next.config.ts` leave `/.well-known` alone; `src/lib/site/assetlinks.test.ts`
checks the file and that.

## Fingerprints

`sha256_cert_fingerprints` holds the SHA-256 of every certificate that signs a build which should open
these links:

- `35:33:8B:…:83:BE:85`: the certificate currently signing the app (read from the installed vc70 APK,
  12 Nov 2026). Sideloaded and EAS builds use it. **Keep it.**
- When the app is published through Google Play with Play App Signing, Play Console shows the
  **app signing key certificate** (Setup › App signing › SHA-256). Add that value as a second entry
  in the same array, copied exactly from Play Console. Never add a fingerprint that isn't read from a
  real certificate.

After changing the file, deploy, then check on a device:
`adb shell pm verify-app-links --re-verify com.soulmatesquest.app` and
`adb shell pm get-app-links com.soulmatesquest.app`.

## Host

Android fetches `https://<host>/.well-known/assetlinks.json` for each `host` in the app's
`autoVerify` intent filter and does not follow redirects. The apex `soulmates.quest` answers 308 to
`www`, so verification only succeeds for a filter that lists `www.soulmates.quest`.
