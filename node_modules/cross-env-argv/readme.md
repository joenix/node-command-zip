# Cross Env Argv

> More convenient way to Identify params on 'cross-env'

```js
// package.json
npm run dev port=3000
```

```js
const argv = require("cross-env-argv")(process); // { port: 3000 }
```
