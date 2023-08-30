import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormText, LoginForm } from '@ant-design/pro-components';
import logo from '@/assets/images/woocoo.png';
import Sha256 from 'crypto-js/sha256';
import { useTranslation } from 'react-i18next';
import { CaptchaRes, LoginRes, captcha, login } from '@/services/auth';
import { useEffect, useState } from 'react';
import { Link } from '@ice/runtime';

export default (
  props: {
    onSuccess: (result: LoginRes) => void;
  },
) => {
  const { t } = useTranslation(),
    [captchaInfo, setCaptchaInfo] = useState<CaptchaRes>(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);


  const
    getCaptcha = async () => {
      setCaptchaInfo(await captcha());
    },
    onFinish = async (values: { username: string; password: string; captcha: string }) => {
      if (captchaInfo) {
        setSaveLoading(true);
        const result = await login(
          values.username,
          Sha256(values.password).toString(),
          values.captcha,
          captchaInfo.captchaId,
        );
        if (result && !result.errors) {
          props.onSuccess(result);
        }
        setSaveLoading(false);
      }
      return false;
    };
  useEffect(() => {
    getCaptcha();
  }, []);

  return (
    <LoginForm
      title="Adminx Pro"
      logo={<img alt="logo" src={logo} />}
      subTitle={t('manage_system')}
      initialValues={{
        // username: 'admin',
        // password: '123456',
      }}
      submitter={{
        searchConfig: {
          submitText: t('login'),
          resetText: t('cancel'),
        },
        submitButtonProps: {
          loading: saveLoading,
          disabled: saveDisabled,
        },
      }}
      onValuesChange={() => {
        setSaveDisabled(false);
      }}
      onFinish={onFinish}
    >
      <ProFormText
        name="username"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={'prefixIcon'} />,
        }}
        placeholder={`${t('please_enter_principal_name')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_principal_name')}`,
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        placeholder={`${t('please_enter_password')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_password')}`,
          },
        ]}
      />
      <ProFormText
        name="captcha"
        fieldProps={{
          size: 'large',
          addonAfter: <img
            src={captchaInfo?.captchaImage}
            height="32px"
            onClick={() => {
              getCaptcha();
            }}
          />,
        }}
        placeholder={`${t('auth_code')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_auth_code')}`,
          },
        ]}
      />
      <div style={{ marginBottom: 24 }}>
        <Link
          style={{ float: 'right' }}
          to="/login/retrievePassword"
        >
          {t('forget_password')}
        </Link>
      </div>
    </LoginForm>
  );
};
