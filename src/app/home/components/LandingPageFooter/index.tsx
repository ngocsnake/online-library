"use client";

import styles from "./styles.module.scss";
import LogoMain from "@/assets/figures/logo-main.png";
import {Col, Input, Row, Typography} from "antd";
import {FacebookOutlined, InstagramOutlined, SendOutlined, TwitterOutlined, YoutubeFilled} from "@ant-design/icons";
import {Link as LinkS} from "react-scroll/modules";

const socials = [
  {key: "instagram", name: "Instagram", url: "", icon: <InstagramOutlined/>},
  {key: "facebook", name: "Facebook", url: "", icon: <FacebookOutlined/>},
  {key: "twitter", name: "Twitter", url: "", icon: <TwitterOutlined/>},
  {key: "youtube", name: "Youtube", url: "", icon: <YoutubeFilled/>}
]

export const pages = [
  {key: "home", title: "Trang chủ", path: "home"},
  {key: "introduction", title: "Về D Free Books", path: "introduction"},
  {key: "book", title: "Sách", path: "book"},
  {key: "activities", title: "Hoạt động", path: "activities"},
  {key: "contact", title: "Liên hệ", path: "contact"}
]

export const supports = [
  {key: "support-policy", title: "Chính sách hỗ trợ", path: "#"},
  {key: "return-policy", title: "Chính sách đổi trả", path: "#"},
  {key: "Security", title: "Bảo mật", path: "#"},
  {key: "information", title: "Thông tin", path: "#"},
]

export default function LandingPageFooter() {
  return (
    <div className={styles.wrapper}>
      <Row className={styles.footer} gutter={[32,32]}>
        <Col xs={24} md={12} lg={10}>
          <div>
            <img src={LogoMain.src} alt={"Logo"} className={styles.logo}/>
            <Typography.Text className="visible mt-3 mb-10">
              D Free Book là một thư viện cộng đồng cho mượn
              <Typography.Text className="visible">sách miễn phí và đặt cọc niềm tin.</Typography.Text>
            </Typography.Text>
            <div className="flex gap-8">
              {socials.map(item => (
                <div className={styles.socialIcon} key={item.key}>
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col xs={24} md={12} lg={4}>
          <div>
            <Typography.Title className="mb-6" level={4}>Trang</Typography.Title>
            <div className="flex flex-col gap-3">
              {
                pages.map(item => (
                  <LinkS
                    className={styles.textHover}
                    key={item.key}
                    to={item.path}
                    spy
                    smooth
                    offset={0}
                    duration={500}
                  >
                    {item.title}
                  </LinkS>
                ))
              }
            </div>
          </div>
        </Col>
        <Col xs={24} md={12} lg={4}>
          <div>
            <Typography.Title className="mb-6" level={4}>Hỗ trợ</Typography.Title>
            <div className="flex flex-col gap-3">
              {
                supports.map(item => (
                  <LinkS
                    className={styles.textHover}
                    key={item.key}
                    to={item.path}
                    spy
                    smooth
                    offset={0}
                    duration={500}
                  >
                    {item.title}
                  </LinkS>
                ))
              }
            </div>
          </div>
        </Col>
        <Col xs={24} md={12} lg={6}>
         <div>
           <Typography.Title className="mb-6" level={4}>Giữ liên lạc</Typography.Title>
           <Input
             size="large"
             className={styles.emailInput}
             placeholder="Điền email"
             suffix={<SendOutlined/>}
           />
         </div>
        </Col>
      </Row>
    </div>
  )
}