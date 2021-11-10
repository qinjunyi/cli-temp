import { decode, encode } from 'ini';
import { promisify } from 'util';
import fs from 'fs';
import { RC_DIRECTORY, RC_DEFAULTS } from '../constants';

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export const get = async (k: string) => {
  const has = await exists(RC_DIRECTORY);
  let opts;
  if (has) {
    opts = await readFile(RC_DIRECTORY, 'utf8');
    opts = decode(opts);
    return JSON.stringify(opts) === '{}' ? RC_DEFAULTS[k] : opts[k];
  }
  return RC_DEFAULTS[k];
};

export const set = async (k: string, v: string) => {
  const has = await exists(RC_DIRECTORY);
  let opts;
  if (has) {
    opts = await readFile(RC_DIRECTORY, 'utf8');
    opts = decode(opts);
    Object.assign(opts, { [k]: v });
  } else {
    opts = Object.assign(RC_DEFAULTS, { [k]: v });
  }
  await writeFile(RC_DIRECTORY, encode(opts), 'utf8');
};

export const remove = async (k: string, all: boolean) => {
  const has = await exists(RC_DIRECTORY);
  let opts;
  if (has) {
    opts = await readFile(RC_DIRECTORY, 'utf8');
    opts = decode(opts);
    if (!all) {
      delete opts[k];
    } else {
      opts = {};
    }
    await writeFile(RC_DIRECTORY, encode(opts), 'utf8');
  } else {
    delete RC_DEFAULTS[k];
  }
};

export const getAll = async (): Promise<Common.IRC> => {
  const has = await exists(RC_DIRECTORY);
  let opts;
  if (has) {
    opts = await readFile(RC_DIRECTORY, 'utf8');
    opts = decode(opts);
    return JSON.stringify(opts) === '{}' ? RC_DEFAULTS : opts;
  }
  return RC_DEFAULTS;
};
