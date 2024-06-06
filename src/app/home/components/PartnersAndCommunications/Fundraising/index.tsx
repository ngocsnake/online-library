"use client";

import styles from "./styles.module.scss";
import {Col, Row, Typography} from "antd";
import {HandHoldingDollar} from "@/components/icons/HandHoldingDollar";

export default function Fundraising() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Row gutter={[48, 48]}>
          <Col xs={24} lg={12}>
            <div className={styles.image}>
              <img src="/images/image-1.jpg" alt="img"/>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className={`${styles.info} lg-items-center`}>
              <div className={styles.box}>
                <HandHoldingDollar/>
                <Typography.Text>Chia sẻ cộng đồng</Typography.Text>
              </div>
              <Typography.Title level={1}>Gây quỹ cùng thư viện</Typography.Title>
              <Typography.Text className="lg-text-center">
                Bạn đọc và các cá nhân, tổ chức có thể đồng hành cùng D Free Book trong hành trình lan toả văn hoá đọc tại:
              </Typography.Text>
              <div className={styles.bank}>
                <img className={styles.image} src="/images/mb-bank.svg" alt="img"/>
                <div className="flex flex-col gap-1">
                  <Typography.Text>Ngân hàng MB Bank</Typography.Text>
                  <Typography.Text>STK: 3174</Typography.Text>
                  <Typography.Text>Người đại diện: Trần Thị Hồng Nhung</Typography.Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}