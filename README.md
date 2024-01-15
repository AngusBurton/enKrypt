## Getting Started - Enkrypt

To get started make sure you have `nodejs` and `nvm` installed on your system

### Prerequisites

- npm
  ```sh
  nvm install 16
  nvm use 16
  npm install yarn -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/enkryptcom/enKrypt.git
   ```
2. Install NPM packages
   ```sh
   yarn install
   ```
3. Build the project and watch for changes
   ```sh
   yarn watch-extension # chromium based browsers
   yarn watch:firefox # firefox
   ```
4. Build the project for release
   ```sh
   yarn build:all
   yarn build:chrome # chromium based browsers
   yarn build:firefox # firefox
   ```
5. Add to your browser
   - [Chrome/Brave/Opera](https://developer.chrome.com/docs/extensions/mv2/getstarted/#manifest)
   - [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)

<p align="right">(<a href="#top">back to top</a>)</p>

## Tide Integration

1. Start tide-web-server
   ```sh
   docker-compose up
   npm run dev
   ```
2. Run installation above for enkyrpt
   ```sh
   yarn install
   yarn build:all
   yarn build:chrome
   ```
3. Add the dist folder to chrome://extensions

## Demo - Information

### Problem with Enkrypt
The main problem with Enkrypt and many other extension based crypto wallets is the security and storage of the seed phrase also known as a recovery or security phrase. Currently Enkrypt secures the entire wallet (seed phrase) using a master password which is not very ideal as if a bad actor can get into your device they can brute force this offline and get access to your crypto. This is also means the phrase is stored on the device, which makes it impossible to login to Enkrypt on a different device, without copy pasting the recovery phrase over to the new device which is not very secure or ideal.

>So the main problem --> managing and storing the encrypted seed phrase

### Solution - Tide
The Tide integration with the Enkyrpt crypto wallet solves both these problems. Firstly, the new crypto wallet implements Tide which replaces the master-password flow for the secure Tide login flow which is used to unlock the wallet instead. This is great as it's a lot more secure however the phrase still needs to be stored somewhere. Instead of storing the encrypted phrase on a user's device we are instead storing it on a secure web server. The main benefit this provides is that it allows the user to login through Tide to the same Enkrypt wallet from any device.

### How does this solution work?

We leverage the Tide Heimdall SDK to securely encrypt and decrypt the seed phrase. On initalisation the Enkrypt onboard flow will encrypt a generated security phrase using heimdall and send that encrypted phrase to a secure web server where it is stored. When someone requests to unlock their vault a request is sent to the web server which verifies the incoming jwt with the user's public key, if this succeeds it returns the user's encrypted phrase, which will be used in the extension to unlock the vault.  

#### TideEnkrypt - Initalisation / Onboard Flow
![image](https://github.com/AngusBurton/enKrypt/assets/43803141/df6523b8-5291-47a1-afaf-950d8580b919)

### How Solution helped - Public

Unfortunately there were some complications when submitting to the Chrome extension store related heimdall config and the chrome extension id.

