import chalk from 'chalk';

const EventEmitter = require('events');

const chalkTag = (tag: any) => chalk.bgBlackBright.white.dim(` ${tag} `);
const logEvents = new EventEmitter();

function _log(type: Common.LogType, tag: any, message?: string) {
  if (message) {
    // TODO:本地生成日志文件？
    logEvents.emit('log', {
      message,
      type,
      tag
    });
  }
}

const warn = (msg: string, tag?: string) => {
  if (msg.includes('\n')) {
    console.warn(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''));
    console.warn(chalk.yellow(msg));
  } else {
    console.warn(
      chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''),
      chalk.yellow(msg)
    );
  }
  _log('warn', tag, msg);
};

const error = (msg: string | Error, tag?: string) => {
  if (msg instanceof Error) {
    console.error(msg.stack);
    _log('error', tag, msg.stack);
  } else {
    if (msg.includes('\n')) {
      console.error(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''));
      console.error(chalk.red(msg));
    } else {
      console.error(
        chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''),
        chalk.red(msg)
      );
    }
    _log('error', tag, msg);
  }
};

const log = (msg = '', tag?: string) => {
  if (tag) {
    if (msg.includes('\n')) {
      console.log(chalkTag(tag));
      console.log(msg);
    } else {
      console.log(chalkTag(tag), msg);
    }
  } else {
    console.log(msg);
  }
  _log('log', tag, msg);
};

const info = (msg: string, tag?: string) => {
  if (msg.includes('\n')) {
    console.log(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''));
    console.log(msg);
  } else {
    console.log(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg);
  }
  _log('info', tag, msg);
};

export { log, warn, info, error };
