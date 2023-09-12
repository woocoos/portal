import store from '@/store';
import { useEffect, useState } from 'react';
import defaultAvatar from '@/assets/images/default-avatar.png';
import i18n from '@/i18n';
import { monitorKeyChange } from '@/pkg/localStore';
import { Layout, CollectProviders, useLeavePrompt } from '@knockout-js/layout';
import { logout, urlSpm } from '@/services/auth';
import { createFromIconfontCN } from '@ant-design/icons';
import { getAppConfigs } from '@/services/appConfig';
import { appHistory } from '@ice/stark-app';
import { files } from '@knockout-js/api';

const ICE_APP_CODE = process.env.ICE_APP_CODE ?? '',
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
    [open, setOpen] = useState(false),
    [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    if (userState.user?.avatarFileId) {
      files.getFilesRaw(userState.user?.avatarFileId, 'url').then(result => {
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
      pathname={pathname}
      appCode={ICE_APP_CODE}
      tenantId={userState.tenantId}>
      {children}
    </CollectProviders>
  }

  return <Layout
    appCode={ICE_APP_CODE}
    pathname={pathname}
    IconFont={IconFont}
    aggregateMenuProps={{
      open,
      onChangeOpen: setOpen,
      onClick: async (menuItem, app, isOpen) => {
        const configs = await getAppConfigs();
        const conf = configs.find(item => item.name === app.code);
        if (conf) {
          const url = await urlSpm(`${conf.path}${menuItem.route ?? ''}`)
          if (isOpen) {
            window.open(url);
          } else {
            appHistory?.push(url);
            setOpen(false);
          }
        }
      },
    }}
    onClickMenuItem={async (item, isOpen) => {
      const url = await urlSpm(item.path ?? '')
      if (isOpen) {
        window.open(url);
      } else {
        appHistory?.push(url);
      }
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
