import { defineAppConfig, defineDataLoader } from 'ice';
import { defineAuthConfig } from '@ice/plugin-auth/esm/types';
import { defineStoreConfig } from '@ice/plugin-store/esm/types';
import { defineRequestConfig } from '@ice/plugin-request/esm/types';
import { defineUrqlConfig, requestInterceptor } from "@knockout-js/ice-urql/types";
import store from '@/store';
import '@/assets/styles/index.css';
import { getItem, removeItem } from '@/pkg/localStore';
import { browserLanguage } from './util';
import jwtDcode, { JwtPayload } from 'jwt-decode';
import { defineFrameworkConfig } from '@ice/plugin-icestark/types';
import { User, files, userPermissions } from '@knockout-js/api';
import { logout, parseSpm } from './services/auth';
import FrameworkLayout from '@/components/layout';
import { getAppConfigs } from '@/components/layout/appConfig';
import PageLoading from '@/components/pageLoading';

const ICE_API_ADMINX = process.env.ICE_API_ADMINX ?? '',
  ICE_APP_CODE = process.env.ICE_APP_CODE ?? '',
  ICE_LOGIN_URL = process.env.ICE_LOGIN_URL ?? '',
  ICE_API_AUTH_PREFIX = process.env.ICE_API_AUTH_PREFIX ?? '',
  ICE_API_FILES_PREFIX = process.env.ICE_API_FILES_PREFIX ?? '';

files.setFilesApi(ICE_API_FILES_PREFIX);

export const icestark = defineFrameworkConfig(() => ({
  layout: FrameworkLayout,
  getApps: async (data) => {
    const config = await getAppConfigs();
    return config.map(item => {
      item.props = data;
      return item;
    })
  },
  appRouter: {
    LoadingComponent: PageLoading,
    shouldAssetsRemove: (assetUrl) => {
      if (!assetUrl || assetUrl.includes(location.host)) {
        return false
      }
      return true
    },
  },
}));

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  // Set your configs here.
  app: {
    rootId: 'app',
  },
}));

// 用来做初始化数据
export const dataLoader = defineDataLoader(async () => {
  const signCid = `sign_cid=${ICE_APP_CODE}`
  if (document.cookie.indexOf(signCid) === -1) {
    removeItem('token')
    removeItem('refreshToken')
  }
  document.cookie = signCid
  const spmData = await parseSpm()
  let locale = getItem<string>('locale'),
    token = spmData.tenantId ?? getItem<string>('token'),
    refreshToken = spmData.refreshToken ?? getItem<string>('refreshToken'),
    darkMode = getItem<string>('darkMode'),
    compactMode = getItem<string>('compactMode'),
    tenantId = spmData.tenantId ?? getItem<string>('tenantId'),
    user = spmData.user ?? getItem<User>('user');

  if (token) {
    // 增加jwt判断token过期的处理
    try {
      const jwt = jwtDcode<JwtPayload>(token);
      if ((jwt.exp || 0) * 1000 < Date.now()) {
        token = '';
      }
    } catch (err) {
      token = '';
    }
  }
  if (!locale) {
    locale = browserLanguage();
  }

  return {
    app: {
      locale,
      darkMode,
      compactMode,
    },
    user: {
      token,
      refreshToken,
      tenantId,
      user,
    },
  };
});

// urql
export const urqlConfig = defineUrqlConfig([
  {
    instanceName: 'default',
    url: ICE_API_ADMINX,
    exchangeOpt: {
      authOpts: {
        store: {
          getState: () => {
            const { token, tenantId, refreshToken } = store.getModelState('user')
            return {
              token, tenantId, refreshToken
            }
          },
          setStateToken: (newToken) => {
            store.dispatch.user.updateToken(newToken)
          }
        },
        login: ICE_LOGIN_URL ?? '/login',
        refreshApi: `${ICE_API_AUTH_PREFIX ?? '/api-auth'}/login/refresh-token`
      }
    }
  },
])


// 权限
export const authConfig = defineAuthConfig(async (appData) => {
  const { user } = appData,
    initialAuth = {};
  // 判断路由权限
  if (!['/login', '/login/retrievePassword'].includes(location.pathname)) {
    if (user.token) {
      const ups = await userPermissions(ICE_APP_CODE, {
        Authorization: `Bearer ${user.token}`,
        'X-Tenant-ID': user.tenantId,
      });
      if (ups) {
        ups.forEach(item => {
          if (item) {
            initialAuth[item.name] = true;
          }
        });
      }
    } else {
      await logout();
    }
  }
  return {
    initialAuth,
  };
});

// store数据项
export const storeConfig = defineStoreConfig(async (appData) => {
  const { app, user } = appData;
  return {
    initialStates: {
      app,
      user,
    },
  };
});

// 请求配置
export const requestConfig = defineRequestConfig({
  interceptors: requestInterceptor({
    store: {
      getState: () => {
        const { token, tenantId } = store.getModelState('user');
        return {
          token, tenantId
        }
      },
    },
    login: ICE_LOGIN_URL,
  })
});

