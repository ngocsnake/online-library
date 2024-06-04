"use client";

import styles from "./styles.module.scss";
import {Col, Row, Typography} from "antd";
import {activities} from "./data";

export default function Activities() {
  return (
    <div id="activities" className={styles.wrapper}>
      <div className={styles.container}>
        <div>
          <Typography.Title className="mb-2 text-center">Hoạt động</Typography.Title>
          <Typography.Text className="text-center visible">
            Các hoạt động sôi nổi diễn ra tại D Free Book
          </Typography.Text>
        </div>
        <div className="mt-16 pb-10 ">
          <Row gutter={[24, 24]}>
            {activities.map(item => (
              <Col xs={24} md={12} lg={8} key={item.id}>
                <div className={styles.activityItem}>
                  <img className={styles.activityImage} src={item.image} alt="activity"/>
                  <div className={styles.activityContent}>
                    <Typography.Title level={4} className="text-center pt-2 pb-4">{item.title}</Typography.Title>
                    <Typography.Paragraph className="text-center">{item.description}</Typography.Paragraph>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  )
}