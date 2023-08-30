import { ProFormText, LoginForm } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { LoginRes, loginVerifyFactor } from '@/services/auth';
import { useState } from 'react';

export default (
  props: {
    stateToken: string;
    onSuccess: (result: LoginRes) => void;
  },
) => {
  const { t } = useTranslation(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  const onFinish = async (values: { code: string }) => {
    setSaveLoading(true);
    const result = await loginVerifyFactor('loginVerifyFactor', props.stateToken, values.code);
    if (result && !result.errors) {
      props.onSuccess(result);
    }
    setSaveLoading(false);
    return false;
  };

  return (
    <LoginForm
      title={t('MFA')}
      submitter={{
        searchConfig: {
          submitText: t('verify'),
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
      <br />
      <ProFormText
        name="code"
        placeholder={`${t('please_enter_security_code')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_security_code')}`,
          },
        ]}
      />

    </LoginForm>
  );
};
