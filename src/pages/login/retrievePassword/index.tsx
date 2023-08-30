import { ForgetPwdBeginRes } from '@/services/auth';
import Authentication from './components/authentication';
import PasswordStep from './components/passwordStep';
import styles from '../index.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation(),
    [token, setToken] = useState<ForgetPwdBeginRes>();

  document.title = t('retrieve_pwd');


  return (<div className={styles.container}>
    <div className="container-item">
      {token ? <PasswordStep token={token} /> : <Authentication
        onSuccess={(result) => {
          setToken(result);
        }}
      />}
    </div>
  </div>);
};
