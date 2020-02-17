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
node build/main.js -w https://www.crawler-test.com/ -c 2 -l 50
```

### Usage inside docker container
Build docker image
```bash
docker build -t <your-username>/crawler .
```

Run container with that image and open a shell to make commands inside
```bash
docker run -it <your-username>/crawler /bin/sh
node build/main.js -w https://www.crawler-test.com/ -c 2 -l 50
```

You can run also directly:
```bash
docker run <your-username>/crawler node build/main.js -w https://www.crawler-test.com/ -c 2 -l 50
```


