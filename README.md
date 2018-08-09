# Browser and Electron application for Minotá

## Development notes

Service consists from several parts, each with it's own repository. To be able to develop all of them, you will need to `npm link` them (check [npm link help](https://docs.npmjs.com/cli/link)).

First globally each one, then inside each one link others (check dependencies inside `package.json`, where needed 'minota-'' dependencies are listed).

For example:

```
cd minota-shared.git
npm link
cd ../minota-storage.git
npm link
cd ../minota-server.git
npm link
cd ../minota-cli.git
npm link

cd ../minota-storage.git
npm link minota-shared
cd ../minota-server.git
npm link minota-shared minota-storage
cd ../minota-cli.git
npm link minota-shared minota-storage minota-server
```

**How-to**

Project is created with [Vue CLI 3](http://cli.vuejs.org), so it's standard commands are applicable:

- Project setup: `npm install`.
- Compiles and hot-reloads for development: `npm run serve`.
- Compiles and minifies for production: `npm run build`.
- Lints and fixes files: `npm run lint`.
- Run your unit tests: `npm run test:unit`.
