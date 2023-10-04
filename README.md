# env-sync

`env-sync` automates the process of syncing and saving examples of all your
`env` files. No more manually updating env samples

<img src="./demo.gif">

## Global Installation

```bash
$ npm install @ize-302/env-sync -g
```

#### Usage (Run this command in the root of your working directory)

```bash
$ env-sync
```

## Repo Installation (**recommended**)

```bash
$ npm install @ize-302/env-sync -D
```

#### Usage

1. Insert as script command

```js
// package.json
{
  "scripts": {
    "env": "@ize-302/env-sync"
  }
}
```

2. Run it

```bash
$ npm run env
```

### Notes

```
1. Only environmental variables (EV) with values will be synced. EVs without stated values will not be synced.

2. If a new .env file is added while running env-sync, you will have to close the process and run the command again to be able to  sync the newly added .env file

3. All generated env examples are stored in the env-examples folder at the root of your working directory

4. For feature requests/bug report, feel free to open a new issue. Will be happy to look into it
```
