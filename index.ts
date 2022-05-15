import {exec} from 'child_process';
import {readFile, writeFile} from 'fs';
import ora from 'ora';
import {join} from 'path';
import {promisify} from 'util';
import {LINT_STAGE_CONFIG, PRETTIER_CONFIG} from './config.js';

const execAsync = promisify(exec);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

let packageJson: any;
const packageJsonPath = join(process.cwd(), 'package.json');
const spinner = ora({
  text: 'Installing dependencies',
  color: 'blue',
  isEnabled: true,
}).start();

execAsync('npm install -D husky')
  .then(() => {
    return execAsync('npm install -D lint-staged');
  })
  .then(() => {
    return execAsync('npm install -D prettier');
  })
  .then(() => {
    return readFileAsync(packageJsonPath, 'utf8');
  })
  .then((data) => {
    spinner.succeed();

    packageJson = JSON.parse(data);
    spinner.color = 'green';
    spinner.start('Adding lint-staged config');

    packageJson['lint-staged'] = LINT_STAGE_CONFIG;

    return writeFileAsync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
  })
  .then(() => {
    spinner.succeed();
    spinner.color = 'yellow';
    spinner.start('Adding prettier config');

    const prettierPath = join(process.cwd(), '.prettierrc');

    return writeFileAsync(
      prettierPath,
      JSON.stringify(PRETTIER_CONFIG, null, 2)
    );
  })
  .then(() => {
    spinner.succeed();
    spinner.color = 'red';
    spinner.start('Adding husky hooks');

    return execAsync('npx husky install');
  })
  .then(() => {
    return execAsync('npx husky add .husky/pre-commit "npx lint-staged"');
  })
  .then(() => {
    spinner.succeed('Done!');
  })
  .catch((err) => {
    console.log(err);
  });
