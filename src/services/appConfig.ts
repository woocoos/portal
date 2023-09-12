import { AppConfig } from "@ice/plugin-icestark/types"
import { request } from 'ice';

const ICE_APP_CONFIG_ADDRESS = process.env.ICE_APP_CONFIG_ADDRESS ?? '',
  appConfig: AppConfig[] = [];

export const getAppConfigs = async () => {
  if (appConfig.length === 0) {
    if (ICE_APP_CONFIG_ADDRESS) {
      const result: AppConfig[] = await request.get(ICE_APP_CONFIG_ADDRESS);
      if (Array.isArray(result)) {
        appConfig.push(...result)
      }
    } else {
      appConfig.push({
        path: '/ucenter',
        name: "app1",
        title: '用户中心',
        loadScriptMode: "fetch",
        sandbox: true,
        entry: 'http://127.0.0.1:8801',
      },
        // {
        //   path: '/msg',
        //   name: "msg",
        //   title: '消息中心',
        //   loadScriptMode: "fetch",
        //   sandbox: true,
        //   entry: 'http://127.0.0.1:3002',
        // }
      )
    }
  }
  return appConfig;
}
