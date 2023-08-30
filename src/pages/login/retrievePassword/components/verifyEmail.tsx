import { forgetPwdSendEmail, forgetPwdVerifyEmail } from '@/services/auth';
import { LoginForm, ProFormCaptcha } from '@ant-design/pro-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default (props: {
  token: string;
  onSuccess: (token: string) => void;
  onChangeMode: () => void;
}) => {
  const { t } = useTranslation(),
    [captchaId, setCaptchaId] = useState<string>(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  const onFinish = async (values: { captcha: string }) => {
    if (captchaId) {
      setSaveLoading(true);
      const result = await forgetPwdVerifyEmail(props.token, values.captcha, captchaId);
      if (result?.stateToken) {
        props.onSuccess(result.stateToken);
      }
      setSaveLoading(false);
    }
    return false;
  };
  return (<>
    <LoginForm
      title={t('email_auth')}
      subTitle={t('pwd_step_0_email_title_{{field}}', { field: 'xxx' })}
      submitter={{
        searchConfig: {
          submitText: t('confirm'),
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
      <ProFormCaptcha
        name="captcha"
        label={t('auth_code')}
        placeholder={`${t('please_enter_auth_code')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_auth_code')}`,
          },
        ]}
        onGetCaptcha={() => {
          return new Promise(async (resolve) => {
            const result = await forgetPwdSendEmail(props.token);
            if (typeof result === 'string') {
              setCaptchaId(result);
            }
            resolve();
          });
        }}
      />
      <div style={{ marginBottom: 24 }} >
        <a style={{ float: 'right' }} onClick={() => props.onChangeMode()}>
          {t('pwd_step_0_ther')}
        </a>
      </div>
    </LoginForm>
  </>);
};
