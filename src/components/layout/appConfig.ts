import { AppConfig } from "@ice/plugin-icestark/types"

export default [
  {
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
] as AppConfig[]
