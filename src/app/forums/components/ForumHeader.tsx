"use client";

import { FormAction } from "@/constants/app.constant";
import useDebounce from "@/lib/hooks/useDebounce";
import { useDisclosure } from "@/lib/hooks/useDisclosure";
import { SearchOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Input, Modal, Row, Typography } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PostForm from "../(form)/components/PostForm";
import Link from "next/link";
import dayjs from "dayjs";

export default function ForumHeader({
  totalDocs = 0,
  onFinish,
  author,
}: {
  totalDocs?: number;
  onFinish: any;
  author?: Account;
}) {
  const postModal = useDisclosure();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryInit = searchParams.get("query");
  const [query, setQuery] = useState(queryInit ?? "");
  const queryDebounce = useDebounce(query);

  const createQueryString = useCallback(
    (paramsToUpdate: any) => {
      const updatedParams = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([key, value]: any) => {
        if (value === null || value === undefined || value === "") {
          updatedParams.delete(key);
        } else {
          updatedParams.set(key, value);
        }
      });

      router.push(pathname + "?" + updatedParams.toString());
    },
    [searchParams, pathname]
  );

  useEffect(() => {
    createQueryString({ query: query });
  }, [queryDebounce]);

  useEffect(() => {
    const q = searchParams.get("query");
    setQuery(q ?? "");
  }, [pathname, searchParams]);

  return (
    <div className="h-full mb-8">
      <Row gutter={48}>
        <Col span={7}>
          <Flex justify="end" style={{ marginRight: -20 }}>
            {author && (
              <Button type="text" shape="circle" onClick={router.back}>
                <LeftOutlined />
              </Button>
            )}
          </Flex>
        </Col>
        <Col span={10}>
          <Flex justify="space-between">
            <div>
              <Link href={"/forums"}>
                {author ? (
                  <Flex gap={12}>
                    <div>
                      <Typography.Title level={3} className="ma-0">
                        {author.fullName}
                      </Typography.Title>
                      <Typography.Text className="ma-0" type="secondary">
                        Ngày gia nhập:{" "}
                        {dayjs(author.joinDate).format("DD/MM/YYYY")} -{" "}
                        {totalDocs} bài viết
                      </Typography.Text>
                    </div>
                  </Flex>
                ) : (
                  <Flex align="center" gap={4}>
                    <Typography.Title level={3} className="ma-0">
                      Diễn đàn
                    </Typography.Title>
                    <Typography.Title
                      level={5}
                      type="secondary"
                      className="ma-0"
                    >
                      ({totalDocs})
                    </Typography.Title>
                  </Flex>
                )}
              </Link>
            </div>
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
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
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
