import store from '@/store';
import { useEffect, useState } from 'react';
import defaultAvatar from '@/assets/images/default-avatar.png';
import i18n from '@/i18n';
import { monitorKeyChange } from '@/pkg/localStore';
import { getFilesRaw } from '@/services/files';
import { Layout, CollectProviders, useLeavePrompt } from '@knockout-js/layout';
import { logout, urlSpm } from '@/services/auth';
import { createFromIconfontCN } from '@ant-design/icons';
import appConfig from './appConfig';
import { appHistory } from '@ice/stark-app';

const ICE_APP_CODE = process.env.ICE_APP_CODE ?? '',
  NODE_ENV = process.env.NODE_ENV ?? '',
  IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/c/font_4214307_8x56lkek9tu.js"
  })

export default (props: {
  children: React.ReactNode;
  pathname: string;
  appLeave: { path: string };
  appEnter: { path: string };
}) => {
  const { pathname, children, appLeave, appEnter } = props;

  const [userState, userDispatcher] = store.useModel('user'),
    [appState, appDispatcher] = store.useModel('app'),
    [checkLeave] = useLeavePrompt(),
    [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    if (userState.user?.avatarFileId) {
      getFilesRaw(userState.user?.avatarFileId, 'url').then(result => {
        if (typeof result === 'string') {
          setAvatar(result);
        }
      })
    }
  }, [userState.user]);

  useEffect(() => {
    i18n.changeLanguage(appState.locale);
  }, [appState.locale]);

  useEffect(() => {
    monitorKeyChange([
      {
        key: 'tenantId',
        onChange(value) {
          userDispatcher.updateTenantId(value);
        },
      },
      {
        key: 'token',
        onChange(value) {
          userDispatcher.updateToken(value);
        },
      },
      {
        key: 'user',
        onChange(value) {
          userDispatcher.updateUser(value);
        },
      },
      {
        key: 'locale',
        onChange(value) {
          appDispatcher.updateLocale(value);
        },
      },
    ]);
  }, []);

  if (['/login', '/login/retrievePassword'].includes(pathname)) {
    return <CollectProviders locale={appState.locale}
      dark={appState.darkMode}
      pathname={pathname}>
      {children}
    </CollectProviders>
  }

  return <Layout
    appCode={ICE_APP_CODE}
    pathname={pathname}
    IconFont={IconFont}
    gatherMenuProps={{
      storeKey: 'portal-menu',
      onClick: async (menuItem, app) => {
        const conf = appConfig?.find(item => item.name === app.code);
        if (conf) {
          appHistory.push(await urlSpm(`${conf.path}${menuItem.route ?? ''}`))
        }
      },
    }}
    tenantProps={{
      value: userState.tenantId,
      onChange: (value) => {
        userDispatcher.saveTenantId(value);
      },
    }}
    i18nProps={{
      onChange: (value) => {
        appDispatcher.updateLocale(value);
      },
    }}
    avatarProps={{
      avatar: avatar || defaultAvatar,
      name: userState.user?.displayName,
      onLogoutClick: () => {
        if (checkLeave()) {
          logout();
        }
      },
    }}
    themeSwitchProps={{
      value: appState.darkMode,
      onChange: (value) => {
        appDispatcher.updateDarkMode(value);
      },
    }}
  >
    {children}
  </Layout>;
}
