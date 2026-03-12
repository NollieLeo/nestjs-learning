import styles from './Profile.module.scss';
import { Divider } from 'antd';
import ProfileForm from './components/ProfileForm';
import PasswordForm from './components/PasswordForm';

export default function Profile() {
  return (
    <div className={styles.container}>
      <h2>个人设置</h2>
      <div className={styles.formContainer}>
        <ProfileForm />

        <Divider style={{ margin: '40px 0' }} />

        <h3>修改密码</h3>
        <PasswordForm />
      </div>
    </div>
  );
}
