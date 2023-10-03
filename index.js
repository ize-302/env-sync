import fs from "fs";
import readline from "readline";

const root_path = fs.readdirSync('./');
const env_files = root_path.filter(file => file.includes('.env')) // we only want .env files
const folder_path = './env-examples'

// watcher
await fs.watch(import.meta.dir, (event, filename) => {
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
  const file = Bun.file(env_file);
  const file_exists = await file.exists()

  // write to file
  if (file_exists) {
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
        console.log({ key, comment })
        keys.push(`${key}= ${!comment ? '' : comment}`);
      }
    });

    rl.on('close', async () => {
      const content = [
        `# This is a example ${env_file} file.\n`,
        `# Duplicate this file as ${env_file} in the root of the project\n`,
        `# remove the .example extension \n`,
        `# and update the environment variables to match your\n`,
        `# desired config\n`,
        `# NOTE: example file was generated using: env-sync package\n \n`,
      ]
      for (let i = 0; i < keys.length; i++) {
        content.push(`${keys[i]}\n`)
      }
      console.log(`Updated ${env_file} ✅`)
      await Bun.write(`${folder_path}/${env_file.startsWith('env', 1) ? env_file.substring(0) : env_file}.example`, content)
    });
  }
}


// CREATE env-examples FOLDER
fs.access(folder_path, (error) => {
  if (error) {
    console.log('Permission denied!')
  }
  fs.mkdir(folder_path, (error) => {
    // On command, initialially create example of all existsing environmental variables
    env_files.map(async env_file => {
      await writeToFile(env_file)
    })
  });
})


