import { forgetPwdVerifyMfa } from '@/services/auth';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default (props: {
  token: string;
  onSuccess: (token: string) => void;
  onChangeMode: () => void;
}) => {
  const { t } = useTranslation(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  const onFinish = async (values: { otpToken: string }) => {
    setSaveLoading(true);
    const result = await forgetPwdVerifyMfa(props.token, values.otpToken);
    if (result?.stateToken) {
      props.onSuccess(result.stateToken);
    }
    setSaveLoading(false);
    return false;
  };
  return (<>
    <LoginForm
      title={t('mfa_auth')}
      subTitle={t('pwd_step_0_mfa_sub_title')}
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
      <ProFormText
        name="otpToken"
        label={t('security_code')}
        placeholder={`${t('please_enter_security_code')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_security_code')}`,
          },
        ]}
      />
      <div style={{ marginBottom: 24 }} >
        <a style={{ float: 'right' }} onClick={() => props.onChangeMode()}>
          {t('pwd_step_0_ther')}
        </a>
      </div>
    </LoginForm>
  </>);
};
