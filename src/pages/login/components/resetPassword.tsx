import { ProFormText, LoginForm, ProFormInstance } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { LoginRes, loginResetPassword } from '@/services/auth';
import { useRef, useState } from 'react';
import Sha256 from 'crypto-js/sha256';

export default (
  props: {
    stateToken: string;
    onSuccess: (result: LoginRes) => void;
  },
) => {
  const { t } = useTranslation(),
    formRef = useRef<ProFormInstance>(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  const onFinish = async (values: { password: string }) => {
    setSaveLoading(true);
    const result = await loginResetPassword(props.stateToken, Sha256(values.password).toString());
    if (result && !result.errors) {
      props.onSuccess(result);
    }
    setSaveLoading(false);
    return false;
  };

  return (
    <LoginForm
      formRef={formRef}
      title={t('reset_pwd')}
      submitter={{
        searchConfig: {
          submitText: t('submit'),
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
      <ProFormText.Password
        name="password"
        label={t('new_pwd')}
        placeholder={`${t('please_enter_new_pwd')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_new_pwd')}`,
          },
        ]}
      />
      <ProFormText.Password
        name="reNewPwd"
        label={t('confirm_new_pwd')}
        placeholder={`${t('please_enter_confirm_new_pwd')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_confirm_new_pwd')}`,
          },
          {
            validator: (rule, value) => {
              if (value != formRef?.current?.getFieldValue('password')) {
                return Promise.reject(t('confirm_new_pwd_accord'));
              }
              return Promise.resolve();
            },
          },
        ]}
      />
    </LoginForm>
  );
};
