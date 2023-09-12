import { AppConfig } from "@ice/plugin-icestark/types"
import { request } from 'ice';

// "local" | "dev" | "uat" | "main"
const ICE_DEPLOY_ENV = process.env.ICE_DEPLOY_ENV ?? 'local',
  appConfig: AppConfig[] = [];


export const getAppConfigs = async () => {
  if (['dev', 'uat', 'main'].includes(ICE_DEPLOY_ENV)) {
    if (appConfig.length === 0) {
      const result: AppConfig[] = await request.get(`https://qlcdn.oss-cn-shenzhen.aliyuncs.com/cdn/deploy/${ICE_DEPLOY_ENV}/appConfig.json`);
      if (Array.isArray(result)) {
        appConfig.push(...result)
      }
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
  return appConfig;
}
