## WEB CRAWLER

### Development

- Install [nvm](https://github.com/nvm-sh/nvm)
- Find node.js version available
```bash
nvm ls-remote
```
- Install and use latest LTS release
```bash
nvm install v12.16.0
nvm use v12.16.0
```
- Verify version
```bash
node --version
```
- Install dependencies
```bash
npm install
```
- Run dev script
It auto-compiles src/**/*.ts files into .js files located inside build/ dir
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
crawler -h

Options:
  -V, --version                    output the version number
  -w, --website <website>          Add website URL to crawl
  -c, --concurrency <concurrency>  Define concurrency level
  -l, --limit <limit>              Define max items for url tree
  -f, --file <file>                Define file path to write website tree
  -h, --help                       output usage information
```

Example:
```bash
node build/main.js -w https://www.elpais.com/ -c 2 -l 500
```

