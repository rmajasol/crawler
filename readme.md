## WEB CRAWLER

### Development

**Install [nvm](https://github.com/nvm-sh/nvm)**

**Find node.js version available**
```bash
nvm ls-remote
```

**Install and use latest LTS release**
```bash
nvm install v12.16.0
nvm use v12.16.0
```

**Verify version**
```bash
node --version
```

**Install dependencies**
```bash
npm install
```

**Run dev script**

It auto-compiles __src/**/*.ts__ files into __build/**/*.js__ files
```bash
npm run dev
```

### Running tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

### Usage

Check options
```bash
node build/main.js -h
```

#### Example
```bash
node build/main.js -w https://www.elpais.com/ -c 2 -l 50
```

