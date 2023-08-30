import { forgetPwdReset } from '@/services/auth';
import { LoginForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sha256 from 'crypto-js/sha256';

export default (props: {
  token: string;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation(),
    formRef = useRef<ProFormInstance>(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  const onFinish = async (values: { password: string }) => {
    setSaveLoading(true);
    const result = await forgetPwdReset(props.token, Sha256(values.password).toString());
    if (result === true) {
      props.onSuccess();
    }
    setSaveLoading(false);
    return false;
  };
  return (<>
    <LoginForm
      formRef={formRef}
      title={t('set_new_pwd')}
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
      <ProFormText.Password
        name="password"
        label={t('new_pwd')}
        fieldProps={{ autocomplete: 'new-password' } as any}
        placeholder={`${t('please_enter_new_pwd')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_new_pwd')}`,
          },
        ]}
      />
      <ProFormText.Password
        name="confirmPassword"
        label={t('confirm_new_pwd')}
        fieldProps={{ autocomplete: 'new-password' } as any}
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
  </>);
};
