import { Command, Option } from 'commander'; // 命令行工具
import chalk from 'chalk'; // 命令行输出美化
import didYouMean from 'didyoumean'; // 简易的智能匹配引擎
import semver from 'semver'; // npm的语义版本包
import { requiredNodeVersion, cliName, version } from './constants';
import operateConfig from './operateConfig';
import checkVersion from './util/checkVersion';
import { warn } from './util/logger';

(async () => {
  const program = new Command();

  didYouMean.threshold = 0.6;

  const checkNodeVersion = (wanted: string, cliName: string) => {
    // 检测node版本是否符合要求范围
    if (!semver.satisfies(process.version, wanted)) {
      console.log(
        chalk.red(
          'You are using Node ' +
            process.version +
            ', but this version of ' +
            cliName +
            ' requires Node ' +
            wanted +
            '.\nPlease upgrade your Node version.'
        )
      );
      // 退出进程
      process.exit(1);
    }
  };

  // 检测node版本
  checkNodeVersion(requiredNodeVersion, cliName);

  try {
    await checkVersion();
  } catch (e) {
    console.log(e);
  }

  program
    .version(version, '-v, --version') // 版本
    .usage('<command> [options]'); // 使用信息

  const cmdArr: Common.CmdOps = [
    {
      cmd: 'helloWord',
      alias: 'hw',
      desc: 'xxx',
      action: () => {
        console.log('hello world!');
      },
      examples: ['cli hw']
    },
    {
      cmd: 'config <action> [key] [value]',
      alias: 'conf',
      desc: '操作本地cli配置',
      options: ['-a, --all', '是否操作全部配置项'],
      action: operateConfig,
      argsLen: 3,
      examples: [
        'cli config set [k] [v]',
        'cli config get [k]',
        'cli config remove [k]',
        'cli config get -a',
        'cli config remove -a'
      ]
    }
  ];

  cmdArr.forEach((cmdObj) => {
    let args: string[] = [];
    let ops: any = {};
    const temp = program
      .command(cmdObj.cmd)
      .alias(cmdObj.alias)
      .description(cmdObj.desc)
      .hook('preAction', async (thisCommand, actionCommand) => {
        args = actionCommand.args;
        ops = actionCommand.opts();
        // 输入参数校验
        validateArgsLen(actionCommand.args.length, cmdObj.argsLen || 0);
      })
      .action(async () => {
        cmdObj.action(args, ops);
      });
    if (cmdObj.options) {
      temp.addOption(new Option(cmdObj.options[0], cmdObj.options[1]));
    }
  });

  let extraHelp = '\nExamples';
  cmdArr.forEach((cmd: any) => {
    cmd.examples.forEach((example: string[]) => {
      extraHelp = `${extraHelp}\n  ${example}`;
    });
  });
  program.addHelpText('after', extraHelp);

  // 处理非法命令
  program.arguments('<command>').action((cmd) => {
    // 不退出输出帮助信息
    program.outputHelp();
    console.log(chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
    console.log();
    suggestCommands(cmd);
  });

  program.parse(process.argv); // 把命令行参数传给commander解析

  // 输入cli显示帮助信息
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

  // cli支持的命令
  function suggestCommands(cmd: string) {
    const avaliableCommands = program.commands.map((realCmd) => realCmd.name());
    // 简易智能匹配用户命令
    const suggestion = didYouMean(cmd, avaliableCommands);
    if (suggestion) {
      console.log(
        chalk.red(`Did you mean ${chalk.yellow(suggestion as string)}?`)
      );
    }
  }

  function validateArgsLen(argvLen: number, maxArgvLens: number) {
    if (argvLen > maxArgvLens) {
      warn('多余的参数会被忽略');
    }
  }
})();
