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