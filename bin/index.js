#! /usr/bin/env node
import fs from "fs";
import readline from "readline";
import chalk from 'chalk'

const root_files = fs.readdirSync('./');
const env_files = root_files.filter(file => file.includes('.env')) // we only want .env files
if (env_files.length === 0) {
  console.log(chalk.bgRedBright(`⚠️ env-sync:::No env file found. Be sure you are in the right directory`))
}
const folder_path = './env-examples'

// watcher
await fs.watch('./', (event, filename) => {
  if (env_files.includes(filename)) {
    writeToFile(filename)
  }
});


/**
 * Extracts contents of a given .env file and writes to its corresponding example
 * @date 03/10/2023 - 13:46:59
 *
 * @async
 * @param {*} env_file
 * @returns {*}
 */
const writeToFile = async (env_file) => {
  try {
    // read file
    const keys = [];
    const fileStream = fs.createReadStream(env_file);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      const isBlankLine = /^\s*$/;

      // get comments and blank line
      if (line.startsWith('#') || isBlankLine.test(line)) {
        keys.push(line);
      }

      // get keys with comments at the end if any
      const match = line.match(/^\s*([^#\s=]+)\s*=\s*([^#]+?)\s*(#.*)?$/);
      if (match) {
        const key = match[1];
        const comment = match[3] ? match[3].trim() : null;
        keys.push(`${key}= ${!comment ? '' : comment}`);
      }
    });

    rl.on('close', async () => {
      let content =
        `# This is a example ${env_file} file.\n` +
        "# Duplicate this file as ${env_file} in the root of the project\n" +
        "# remove the .example extension \n" +
        "# and update the environment variables to match your\n" +
        "# desired config\n" +
        "# NOTE: example file was generated using: env-sync package\n \n"
      for (let i = 0; i < keys.length; i++) {
        content = content + `${keys[i]}\n`
      }
      try {
        console.log(chalk.gray(`📄 detected change in ${chalk.green(env_file)} was updated, sample updated ✅`))
        await fs.writeFileSync(`${folder_path}/${env_file.startsWith('env', 1) ? env_file.substring(0) : env_file}.example`, content);
      } catch (e) {
        throw new Error(`Sync failed. ${e.message}`);
      }
    });
  } catch (err) {
    console.error(err)
  }
}


const envSync = () => {
  // CREATE env - examples FOLDER
  fs.access(folder_path, () => {
    fs.mkdir(folder_path, () => {
      // On command, initialially create example of all existsing environmental variables
      env_files.map(async env_file => {
        await writeToFile(env_file)
      })
    });
  })
}

envSync()