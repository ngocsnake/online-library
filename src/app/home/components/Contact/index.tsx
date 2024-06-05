"use client";

import styles from "./styles.module.scss";
import {BookOpenCover} from "@/components/icons/BookOpenCover";
import {Typography} from "antd";
import Logo from "@/assets/figures/logo.svg";
import {contacts} from "@/app/home/components/Contact/data";

export default function Contact() {
  return (
    <div id="contact">
      <div className={styles.background}>
        <img src="/images/group-dot.svg" alt={"dot"} className={`${styles.groupDot} xl-hidden`}/>
        <div className={`${styles.container} flex lg:flex-col flex-row`}>
          <div className={styles.contentLeft}>
            <div className={styles.box}>
              <BookOpenCover/>
              <Typography.Text>Kết nối với thư viện </Typography.Text>
            </div>
            <Typography.Title className={styles.title} level={1}>Liên hệ D Free Book</Typography.Title>
            <div className="flex flex-col gap-9">
              {contacts.map(item => {
                const Element = item.type === "email" ? "a" : "div";
                return (
                  <Element
                    style={{textDecoration: "none"}}
                    href={item.type === "email" ? `mailto: ${item.description}` : "#"}
                    key={item.id}
                  >
                    <div className={styles.contactItem}>
                      <div className={styles.icon}>
                        {item.icon}
                      </div>
                      <div className={styles.info}>
                        <Typography.Text strong>{item.title}</Typography.Text>
                        <Typography.Text>{item.description}</Typography.Text>
                      </div>
                    </div>
                  </Element>
                )
              })}

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