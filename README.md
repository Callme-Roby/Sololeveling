# Sololeveling

App mobile React Native (Expo + TypeScript) prete a accueillir un LLM
fine-tune. Cible Android (APK telechargeable depuis les Releases GitHub) et
iOS via EAS Build.

## Stack

- **Expo SDK 51** + **React Native 0.74** + **TypeScript**
- Architecture provider-agnostic pour le LLM (`src/services/llm`)
- UI chat avec streaming token-par-token
- EAS Build pour les binaires Android (.apk / .aab) et iOS (.ipa)
- GitHub Actions pour publier l'APK sur les Releases

## Demarrage local

```bash
npm install
npm run start          # ouvre Expo Dev Tools
npm run android        # lance sur emulateur / appareil Android
npm run ios            # lance sur simulateur iOS (macOS uniquement)
npm run typecheck
```

L'app demarre avec le `MockProvider` : pas besoin de cle API ni de modele
pour tester l'UI.

## Architecture

```
src/
  components/        composants UI (ChatInput, MessageBubble)
  hooks/             hooks React (useChat -> orchestre l'envoi/streaming)
  screens/           ChatScreen
  services/llm/      couche d'abstraction LLM (point d'integration)
    types.ts         contrats TypeScript (LLMProvider, ChatMessage...)
    MockProvider.ts  stub local pour developpement
    RemoteProvider.ts client OpenAI-compatible (vLLM, TGI, llama.cpp...)
    index.ts         getLLM() / configureLLM()
  theme/             couleurs et styles partages
App.tsx              entree React
index.ts             registerRootComponent (Expo)
```

## Brancher le LLM fine-tune

### Cas A — modele heberge derriere une API HTTP

La plupart des stacks de fine-tuning (vLLM, llama.cpp server, TGI, OpenAI
fine-tunes, Together, Groq, gateways compatibles) exposent une route
`POST /v1/chat/completions` au schema OpenAI. Dans `App.tsx` :

```ts
import { configureLLM } from '@/services/llm';

configureLLM({
  providerId: 'remote',
  endpoint: 'https://ton-host/v1/chat/completions',
  apiKey: process.env.EXPO_PUBLIC_LLM_API_KEY,
  modelName: 'sololeveling-ft-v1',
});
```

`RemoteProvider` gere `generate()` et le streaming SSE (`generateStream`).

### Cas B — modele on-device

Cree `src/services/llm/OnDeviceProvider.ts` qui implemente `LLMProvider`.
Backends recommandes :

- **llama.rn** — wrapper React Native pour llama.cpp (modeles GGUF).
- **react-native-mlc-llm** — modeles compiles via MLC.

Puis ajoute le case dans `src/services/llm/index.ts`. La cle est que la
couche UI ne change pas — seul le provider est remplace.

## Build Android (APK)

### Via EAS local

```bash
npm install -g eas-cli
eas login
eas build:configure          # une seule fois, cree le projet EAS
npm run build:android        # profil "preview" -> APK signe
```

L'URL du `.apk` apparait a la fin de la commande et reste accessible dans
le dashboard `expo.dev`.

### Via GitHub Actions (recommande)

1. Cree un token Expo : https://expo.dev/accounts/[user]/settings/access-tokens
2. Dans GitHub, ajoute le secret de repo `EXPO_TOKEN`.
3. Push un tag `v0.1.0` :
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
4. Le workflow `.github/workflows/build-android.yml` :
   - lance `eas build --platform android --profile preview`
   - telecharge le `.apk` produit
   - cree une **Release GitHub** avec le `.apk` attache

L'APK est telechargeable depuis l'onglet **Releases** du repo.

Le workflow peut aussi etre declenche manuellement (Actions -> Build
Android APK -> Run workflow) avec choix du profil.

## Build iOS

```bash
npm run build:ios            # profil production via EAS cloud
```

Pour un build prod il faut un compte Apple Developer paye et provisionner
les credentials (EAS le gere interactivement la premiere fois).

Le workflow `.github/workflows/build-ios.yml` declenche le build cloud sur
tag ou manuellement. La distribution App Store / TestFlight passe par
`eas submit`.

## Profils EAS

Voir `eas.json` :

| Profil           | Plateforme | Sortie       | Usage                      |
| ---------------- | ---------- | ------------ | -------------------------- |
| `preview`        | both       | APK / IPA sim | Tests internes, side-load |
| `production-apk` | android    | APK          | Distribution hors store    |
| `production`     | both       | AAB / IPA    | Play Store / App Store     |
| `development`    | both       | Dev client   | Debug local                |

## Variables d'environnement

Tout ce qui doit etre accessible depuis le client mobile doit etre prefixe
`EXPO_PUBLIC_`. Exemple `.env.local` :

```
EXPO_PUBLIC_LLM_ENDPOINT=https://ton-host/v1/chat/completions
EXPO_PUBLIC_LLM_API_KEY=sk-...
```

Pour des secrets de build (signing, certificats), utilise le store secrets
EAS (`eas secret:create`) — jamais committer dans le repo.

## Roadmap suggeree

- [ ] Implementer `OnDeviceProvider` pour offline (llama.rn).
- [ ] Persistance des conversations (expo-sqlite ou async-storage).
- [ ] Selecteur de provider dans une vue Reglages.
- [ ] Auth pour API privee (expo-secure-store deja installe).
- [ ] CI : ajouter ESLint et tests unitaires sur `src/services/llm`.
