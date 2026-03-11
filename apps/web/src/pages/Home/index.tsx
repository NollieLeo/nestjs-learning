import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>🎉 Welcome</h1>
        <p className={styles.subtitle}>登录成功，欢迎来到主页</p>
      </div>
    </div>
  );
}
