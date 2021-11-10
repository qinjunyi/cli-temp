import { warn } from './util/logger';
import { get, set, remove, getAll } from './util/rc';

export default async (args?: string[], ops?: Record<string, boolean>) => {
  const [action, k, v] = args || [];
  const { all } = ops || {};
  switch (action) {
    case 'get':
      if (!all) {
        const key = await get(k);
        console.log(key);
      } else {
        const obj = await getAll();
        Object.keys(obj).forEach((key) => {
          console.log(`${key}=${obj[key]}`);
        });
      }
      break;
    case 'set':
      set(k, v);
      break;
    case 'remove':
      remove(k, all);
      break;
    default:
      warn('未知操作');
      break;
  }
};
