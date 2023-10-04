# env-sync

`env-sync` automates the process of syncing and saving examples of all your
`env` files. No more manually updating env samples

<img src="./demo.gif">

## Installation

```bash
$ npm install -g env-sync
```

Install as a dev dependency (**recommended**)

```bash
$ npm install -D env-sync
```

## Usage

1. Insert as script command

```js
// package.json
{
  "scripts": {
    "env": "env-sync"
  }
}
```

2. Run it

```bash
$ npm run env
```
