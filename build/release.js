const child_process = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const util = require('util');
const semver = require('semver');
const exec = util.promisify(child_process.exec);
const semverInc = semver.inc;
const pkg = require('../package.json');

const currentVersion = pkg.version;

const run = async (command) => {
  console.log(chalk.green(command));
  return await exec(command);
};

const getNextVersions = () => ({
  major: semverInc(currentVersion, 'major'),
  minor: semverInc(currentVersion, 'minor'),
  patch: semverInc(currentVersion, 'patch'),
  premajor: semverInc(currentVersion, 'premajor'),
  preminor: semverInc(currentVersion, 'preminor'),
  prepatch: semverInc(currentVersion, 'prepatch'),
  prerelease: semverInc(currentVersion, 'prerelease')
});

const promptNextVersion = async () => {
  const nextVersions = getNextVersions();
  const { nextVersion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nextVersion',
      message: `Please select the next version (current version is ${currentVersion})`,
      choices: Object.keys(nextVersions).map((name) => ({
        name: `${name} => ${nextVersions[name]}`,
        value: nextVersions[name]
      }))
    }
  ]);
  return nextVersion;
};

const updatePkgVersion = async (nextVersion) => {
  pkg.version = nextVersion;
  await run(
    `npm version ${nextVersion} -m "release ${nextVersion}" -no-git-tag-version`
  );
};
//TODO:单元测试
// const test = async () => {
//   logTime('Test', 'start')
//   await run(`yarn test:coverage`)
//   logTime('Test', 'end')
// }

const genChangelog = async () => {
  await run('npx conventional-changelog -p angular -i CHANGELOG.md -s');
};

const push = async (nextVersion) => {
  const curBranch = await run('git rev-parse --abbrev-ref HEAD');
  const curBranchName = curBranch.stdout.toString().replace(/\s+/g, '');
  console.log();
  console.log('当前分支名:', curBranchName);
  await run('git add .');
  await run(`git commit -m "ci: 🎡 release v${nextVersion}" -n`);
  await run('git push');
  await run(`git checkout master`);
  await run(
    `git merge ${curBranchName} && git push && git checkout ${curBranchName}`
  );
};

const tag = async (nextVersion) => {
  await run(`git tag v${nextVersion}`);
  await run(`git push origin v${nextVersion}`);
};

const build = async () => {
  await run(`yarn build`);
};

const publish = async () => {
  await run('npm set //registry.npmjs.org/:_authToken xxx');
  await run('npm publish --registry https://registry.npmjs.org/');
};

const main = async () => {
  try {
    const nextVersion = await promptNextVersion();

    // await test();
    await updatePkgVersion(nextVersion);
    await genChangelog();
    await build();
    await push(nextVersion);
    await tag(nextVersion);
    await publish();

    console.log(chalk.green(`Publish Success`));
  } catch (err) {
    console.log(chalk.red(`Publish Fail: ${err}`));
  }
};

main();
