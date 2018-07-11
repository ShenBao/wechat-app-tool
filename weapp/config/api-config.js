import { AddParamsObj } from '../utils/url-utils';
import config from './config';

// host
let host = 'https://www.host.cn/';

let apiObj = {
  // 登录
  loginUrl: `${host}login.json`,

};

let apiConfig = () => {
  let _newApiObj = {};
  let params = {
    appid: config.appid,
    version: config.version
  };
  _newApiObj = AddParamsObj(apiObj, params);
  return _newApiObj;
};

let newApiConfig = {
  host,
  ...apiConfig()
};

module.exports = newApiConfig;