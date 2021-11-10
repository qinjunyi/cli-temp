// 存放用户的所需要的常量
import { version, name, engines } from '../../package.json';

const HOME =
  process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE'];
// rc配置存放位置
const RC_DIRECTORY = `${HOME}/.cliRC`;
//FIXME:根据需要，自行定制rc默认配置
const RC_DEFAULTS: Common.IRC = {
  REGISTRY: 'https://registry.npm.taobao.org/'
};
const nodeVersion = engines.node;
export {
  version,
  name as cliName,
  nodeVersion as requiredNodeVersion,
  HOME,
  RC_DIRECTORY,
  RC_DEFAULTS
};
