# Volunteam

Volunteam is a mobile app that connects volunteers with local volunteer events. Organizers post events that need help, and volunteers find them on a map and sign up.

This repository is an early version of the app. It runs on Android and iOS phones through the free **Expo Go** app.

## Contents

- [Goal and scope](#goal-and-scope)
- [What the app does today](#what-the-app-does-today)
- [How it works](#how-it-works)
- [Setting up your computer](#setting-up-your-computer)
- [Running the app](#running-the-app)
- [Test accounts](#test-accounts)
- [Image uploads (optional)](#image-uploads-optional)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Known issues](#known-issues)

## Goal and scope

**Goal:** make it easy to see which volunteer events are happening nearby and how many helpers each one still needs.

**In scope for this version:**

- Logging in with an email and password
- Staying logged in between app launches (for one hour, until the login expires)
- A map of volunteer events around Calgary
- Logging out

**Not built yet:** creating events, viewing event details, and signing up to volunteer. The buttons for these are on the map screen but don't do anything yet.

## What the app does today

| Screen | What you can do |
|---|---|
| **Login** | Enter your email and password and tap **Log in**. If the email doesn't look like an email address, or the password is shorter than 6 characters, a message appears next to the field. If you logged in less than an hour ago, the app skips this screen. |
| **Events map** | See volunteer events as markers on a map. Tap the **log-out** button (top right) to log out. |

## How it works

The app has two parts:

1. **The app on your phone.** It's built with React Native and Expo, in TypeScript.
2. **A practice server on your computer.** It uses [json-server](https://github.com/typicode/json-server), which serves the data in `db.json` (users and events) as a web API. [json-server-auth](https://github.com/jeremyben/json-server-auth) adds logging in. It returns a login token that lasts one hour.

The phone and the computer talk over your Wi-Fi network, so **both must be on the same network**. The app finds the server by itself: it uses the same computer address that Expo Go connected to.

## Setting up your computer

You only need to do this once.

1. Install **Node.js 22** (the LTS version; 20.19.4 or newer also works) from <https://nodejs.org>. This also installs `npm`, which downloads the project's libraries.
2. Install **Git** from <https://git-scm.com> and download (clone) this project:
   ```
   git clone https://github.com/bootwhistle/assignment-task5.git
   cd assignment-task5
   ```
3. Install the project's libraries:
   ```
   npm install
   ```
4. On your phone, install **Expo Go** from the App Store or Google Play. This project uses **Expo SDK 57**, so you need an Expo Go version that supports SDK 57. If Expo Go says the project is incompatible, see [Troubleshooting](#troubleshooting).

## Running the app

You need **two terminal windows**, both open in the project folder.

**Terminal 1: start the practice server**

```
npx json-server --watch db.json --port 3333 --host 0.0.0.0 -m ./node_modules/json-server-auth
```

Leave it running. `--host 0.0.0.0` lets your phone reach the server over Wi-Fi, not just your computer.

**Terminal 2: start the app**

```
npx expo start
```

A QR code appears. On **Android**, open Expo Go and tap **Scan QR code**. On **iPhone**, scan it with the Camera app. The app loads on your phone. When you save a code change, the app reloads by itself.

To stop either one, click its terminal and press `Ctrl + C`.

## Test accounts

Every account in `db.json` uses the password **`123456`**. For example:

| Email | Password |
|---|---|
| `ulla.ulriksen@example.com` | `123456` |
| `yasemin.akyuz@example.com` | `123456` |

`luigi@carluccio.it` and `john@silva.com.br` are also in `db.json`, but they can't log in yet. See [Known issues](#known-issues).

## Image uploads (optional)

The code for uploading event photos is in `src/services/imageApi.ts`. It uses the free [ImgBB](https://api.imgbb.com/) service. No screen uses it yet, so you can skip this to run the app.

To set it up:

1. Sign up at <https://imgbb.com/signup> and copy your API key.
2. Start the app with the key:
   ```
   IMGBB_API_KEY="your_api_key_here" npx expo start
   ```
3. When you make a build with EAS (Expo's build service), upload your secret values with:
   ```
   eas secret:push
   ```

Never commit your API key to the repository.

## Project structure

```
App.tsx                  Starting point: loads fonts, then shows the screens
app.config.ts            App name, icons, splash screen, permissions, settings
db.json                  Practice data (users and events) for json-server
map-style.json           Colours used by the map
src/
  pages/                 Screens
    Login.tsx              Login form
    EventsMap.tsx          Map of events
  components/            Reusable building blocks
    BigButton.tsx          Large rounded action button
    Spacer.tsx             Empty gap between elements
  routes/AppStack.tsx    List of screens and moving between them; holds the logged-in user
  context/               Shares the logged-in user with every screen
  services/              Talking to the outside world
    api.ts                 Practice server (login)
    caching.ts             Saving data on the phone
    imageApi.ts            Image uploads to ImgBB
  utils/index.ts         Small helpers: email check, date and size formatting, token expiry
  constants/             Map starting point and zoom
  types/                 Shape of a user record
  images/                Logo and map marker images
```

Every function and component in `src/` has a comment above it. The comment says what it's for, what goes in and what comes out.

## Troubleshooting

| Problem | What to try |
|---|---|
| Expo Go says the project is **incompatible** or needs a different SDK | The Expo Go in your app store may be for a newer SDK. Install an Expo Go build for SDK 57 from <https://expo.dev/go>. |
| Login spins and then shows **"Something went wrong."** | The phone can't reach the practice server. Check that Terminal 1 is running, that `--host 0.0.0.0` is in the command, and that the phone and computer are on the same Wi-Fi. Some public or school networks block this. If so, use a phone hotspot. |
| Expo asks you to **log in** | Run `npx expo start --offline` instead. |
| Windows asks whether Node.js may use the network | Allow it on **Private networks**, or the phone can't connect. |
| `npm install` fails | Make sure Node.js is 20.19.4 or newer (`node --version`; 22 is recommended). Then delete the `node_modules` folder and try again. |

## Known issues

- **Some valid email addresses are rejected.** The email check in `src/utils/index.ts` (`validateEmail`) only accepts addresses ending in a 3-letter domain like `.com`. Addresses ending in `.ca`, `.it`, `.info` or `.com.br` show "invalid email". So `luigi@carluccio.it` and `john@silva.com.br` can't log in.
- **The map may be blank in Expo Go on Android.** The map uses Google Maps, which needs a Google Maps API key in a real build. The markers and buttons still work.
- **Events on the map are sample data.** They are copied into `src/pages/EventsMap.tsx` instead of loaded from the server. The footer always says "X event(s) found".
- **The "+" button and the event markers don't do anything yet.** Creating events and showing event details come next.
