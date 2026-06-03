# VirtuoPet
 TODO: description
<br>

## Developer Setup Instructions
(check the discord for instructions for accessing the ssh server, we can't put keys here)
<br>

### Expo
---

#### 1. Install [Node.js](https://nodejs.org/en/download)
Install the prebuilt, not the docker version.
<br>


#### 2. Install pnpm v9:
```bash
npm install -g pnpm@9
```
 - **If you are on Windows use powershell, not wsl.**
 - **Make sure its version 9**.

On Windows you may first need to run:
```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 3. Switch to the client directory

#### 4. Install the node modules:
In the client folder:
```bash
pnpm install
```

#### 5. To run the app:
```bash
pnpm expo start
```
 - you may need to approve builds with
 ```
 pnpm approve-builds
 ```

**Remember `pnpm expo start` must be run inside the `client` folder**
<br>

### Expo Go (Phone App)
---
On your phone, install Expo Go v54 from the App store or Play store. 

 - Make sure you are on the same network on both devices
 - scan the qr code after running expo start.
<br>

### Android Emulator
---
#### 1. Install [Andriod Studio](https://developer.android.com/studio/install)

(the website is down, I found [this](https://www.techspot.com/downloads/6831-android-studio.html) which looks mostly trustworthy...)

After a standard install, select more actions -> virtual device manager 
<br>

#### 2. Create virtual device

I chose pixel 7a arbitrarily 
<br>

#### 3. Start emulator
Let it load untill youare at the homescreen.
<br>

#### 4. Press `a` in the expo terminal to connect to the emulator.
<br>

### Expo tips
 - If the app isnt updating, close the expo app on your phone/emulator, close expo, and run `expo install`` in the client folder again

 

## Sqlite / .env
---
Make sure you have a `.env` file, copy `.enc.example` and rename it to `.env`.
Fill in any values that need to be changed.
