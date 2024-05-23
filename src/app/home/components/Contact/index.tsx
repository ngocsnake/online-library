"use client";

import styles from "./styles.module.scss";
import {BookOpenCover} from "@/components/icons/BookOpenCover";
import {Typography} from "antd";
import {HomeOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import Logo from "@/assets/figures/logo.svg";

export const contacts = [
  {
    id: 1,
    title: "Cơ sở Đại La: ",
    description: "Số 107, khu tập thể A5, ngõ 128C Đại La",
    type: "address",
    icon: <HomeOutlined />,
  },
  {
    id: 2,
    title: "Cơ sở Cầu Giấy: ",
    description: "Số 2 ngõ Viện Máy, đường Phạm Văn Đồng",
    icon:  <HomeOutlined />,
    type: "address"
  },
  {
    id: 1,
    title: "Email",
    description: "thuviendfb@gmail.com",
    icon: <MailOutlined />,
    type: "email"
  },
  {
    id: 1,
    title: "Điện thoại",
    description: "0962.188.248 (Đại La) / 0986.689.024 (Cầu Giấy)",
    icon: <PhoneOutlined />,
    type: "phoneNumber"
  }
];

export default function Contact() {
  return (
    <div id="contact">
      <div className={styles.background}>
        <img src="/images/group-dot.svg" alt={"dot"} className={ `${styles.groupDot} xl-hidden`}/>
        <div className={`${styles.container} flex lg:flex-col flex-row`}>
          <div className={styles.contentLeft}>
            <div className={styles.box}>
              <BookOpenCover/>
              <Typography.Text>Kết nối với thư viện </Typography.Text>
            </div>
            <Typography.Title className={styles.title} level={1}>Liên hệ D Free Book</Typography.Title>
            <div className="flex flex-col gap-9">
              {contacts.map(item => (
                <div key={item.id} className={styles.contactItem}>
                  <div className={styles.icon}>
                    {item.icon}
                  </div>
                  <div className={styles.info}>
                    <Typography.Text strong>{item.title}</Typography.Text>
                    <Typography.Text>{item.description}</Typography.Text>
                  </div>
                </div>
              ))}

            </div>
          </div>
          <div className={`${styles.contentRight}  md-hidden`}>
            <img src={Logo.src} alt={"Logo"} className={styles.logo}/>
            <img
              src="/images/book-lover-bro 1.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  )
}