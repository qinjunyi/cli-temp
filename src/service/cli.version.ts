import axios from 'axios';
import { getAll } from '../util/rc';
export default {
  getPackageVersion: async (repo: string, range: string) => {
    const config = await getAll();
    return axios.get(
      // 关于npm对package的定义 https://docs.npmjs.com/about-packages-and-modules
      `${config.REGISTRY}/${encodeURIComponent(repo).replace(
        /^%40/,
        '@'
      )}/${range}`
    );
  }
};
