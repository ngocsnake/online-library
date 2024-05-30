"use client";
import {Typography} from "antd";
import styles from "./page.module.scss";
import LoginForm from "@/app/auth/login/LoginForm";
import Link from "next/link";

export default function LoginPageContent({redirectUri}: { redirectUri: string }) {
  return <div className={styles.content}>
    <div className={styles.wrapper}>
      <div className={styles.meta}>
        <Typography.Title>
          Đăng nhập
        </Typography.Title>
        <Typography.Paragraph>
          Đăng nhập để khám phá thư viện miễn phí. Chưa có tài khoản? <Link href={'/auth/register'}>Bạn có thể tạo ở
          đây</Link>.
        </Typography.Paragraph>
      </div>

      <LoginForm redirectUri={redirectUri} onSuccess={async () => {

        // router.replace('/');
      }}/>
    </div>
  </div>
}
