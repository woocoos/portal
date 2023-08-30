import { PageContainer, useToken } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';

export default () => {
  const { token } = useToken(),
    { t } = useTranslation();

  return (
    <PageContainer
      header={{
        title: 'hello word',
        style: { background: token.colorBgContainer },
      }}
    >

    </PageContainer>
  );
};

