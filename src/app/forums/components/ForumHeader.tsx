"use client";

import { useDisclosure } from "@/lib/hooks/useDisclosure";
import { Button, Col, Flex, Input, Modal, Row, Typography } from "antd";
import PostForm from "../(form)/components/PostForm";
import { FormAction } from "@/constants/app.constant";
import { SearchOutlined } from "@ant-design/icons";

export default function ForumHeader({
  totalDocs = 0,
  onFinish,
}: {
  totalDocs?: number;
  onFinish: any;
}) {
  const postModal = useDisclosure();

  return (
    <div className="h-full mb-8">
      <Row gutter={48}>
        <Col span={7}></Col>
        <Col span={10}>
          <Flex justify="space-between">
            <Flex align="center" gap={4}>
              <Typography.Title level={3} className="ma-0">
                Diễn đàn
              </Typography.Title>
              <Typography.Title level={5} type="secondary" className="ma-0">
                ({totalDocs})
              </Typography.Title>
            </Flex>
            <Button onClick={postModal.onOpen} type="primary">
              Viết bài
            </Button>
          </Flex>
        </Col>
        <Col span={7}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm bài viết..."
            style={{ width: "50%" }}
          />
        </Col>
      </Row>

      <Modal
        open={postModal.isOpen}
        onCancel={postModal.onClose}
        closeIcon={false}
        footer={false}
        title={
          <Typography.Title level={4} style={{ textAlign: "center" }}>
            Tạo bài đăng
          </Typography.Title>
        }
        width={900}
      >
        <div style={{ height: 500 }}>
          <PostForm
            action={FormAction.CREATE}
            onFinish={() => {
              postModal.onClose();
              onFinish();
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
