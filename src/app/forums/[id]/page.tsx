"use client";

import { SessionContext } from "@/components/shared/SessionContext";
import useRequest, { RequestStatus } from "@/lib/hooks/useRequest";
import { RoleEnum } from "@/lib/models/account.model";
import { postService } from "@/lib/services/post.service";
import {
  CommentOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  HeartFilled,
  HeartOutlined,
  LeftOutlined,
  LineOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Flex,
  MenuProps,
  Modal,
  Row,
  Spin,
  Typography,
  message,
  theme,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import TimeAgo from "javascript-time-ago";
import vi from "javascript-time-ago/locale/vi";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import CommentCard from "../components/CommentCard";

TimeAgo.addDefaultLocale(vi);

export default function FormDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const timeAgo = new TimeAgo("vi-VN");
  const [postData, setPostData] = useState<any>(undefined);
  const [getById, getStatus] = useRequest(postService.getByID);
  const [comment, setComment] = useState("");

  const commentsLevel1 = postData?.comments
    .filter((item: any) => !item.parent)
    .sort((b: any, a: any) => dayjs(a.createdAt).diff(b.createdAt));

  useEffect(() => {
    getById(params.id);
  }, [params.id]);

  const { account } = useContext(SessionContext);
  const [doDelete, deleteStatus] = useRequest(postService.delete);
  const [doReaction, reactionStatus] = useRequest(postService.reaction);
  const [doPin, pinStatus] = useRequest(postService.pin);
  const [doComment, commentStatus] = useRequest(postService.comment);

  useEffect(() => {
    setPostData(getStatus?.data?.data);
  }, [getStatus?.data?.data]);

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const items: MenuProps["items"] = [];

  // if (account?.role !== RoleEnum.USER && postData?.author._id === account?._id) {
  //   items.push({
  //     icon: <EditOutlined />,
  //     label: "Chỉnh sửa bài viết",
  //     key: "edit",
  //   });
  // }

  if (account?.role !== RoleEnum.USER) {
    items.push({
      icon: postData?.pin ? <LineOutlined /> : <PushpinOutlined />,
      label: postData?.pin ? "Bỏ ghim bài viết" : "Ghim bài viết",
      key: "pin",
      onClick: () => {
        doPin(postData?._id);
      },
      disabled: pinStatus.status === RequestStatus.PENDING,
    });
  }
  items.push({
    icon: <DeleteOutlined />,
    label: "Xóa bài viết",
    key: "delete",
    onClick: () => {
      Modal.confirm({
        title: "Hành động này không thể hoàn tác!",
        content: `Xác nhận xóa bài viết`,
        okText: "Xóa",
        cancelText: "Hủy",
        onOk: () => {
          doDelete(postData?._id);
        },
      });
    },
  });

  useEffect(() => {
    if (reactionStatus.status === RequestStatus.FULFILLED) {
      setPostData(reactionStatus?.data);
    }
  }, [reactionStatus.status]);

  useEffect(() => {
    if (pinStatus.status === RequestStatus.FULFILLED) {
      setPostData(pinStatus?.data);
    }
  }, [pinStatus.status]);

  useEffect(() => {
    if (deleteStatus.status === RequestStatus.FULFILLED) {
      message.success("Đã xóa bài viết");
      router.back();
    }
  }, [deleteStatus.status]);

  useEffect(() => {
    if (commentStatus.status === RequestStatus.FULFILLED) {
      setComment("");
      setPostData(commentStatus.data?.data);
    }
  }, [commentStatus.status]);

  const liked = !!postData?.likes?.find(
    (item: any) =>
      item?.toString() === account?._id || item._id === account?._id
  );

  return (
    <Row>
      <Col span={7}></Col>
      <Col span={10}>
        {getStatus.status === RequestStatus.PENDING ? (
          <Flex justify="center" align="center" style={{ minHeight: 700 }}>
            <Spin />
          </Flex>
        ) : (
          <div>
            <Flex justify="space-between">
              <Flex align="center" gap={12}>
                <Button type="text" shape="circle" onClick={router.back}>
                  <LeftOutlined />
                </Button>

                <Typography.Title level={3} className="ma-0">
                  {postData?.title}
                </Typography.Title>
              </Flex>

              {(account?.role === RoleEnum.ADMIN ||
                account?._id === postData?.author?._id) && (
                <div
                  style={{ position: "absolute", right: 12, top: 12 }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <Button type="text" shape="circle">
                      <EllipsisOutlined />
                    </Button>
                  </Dropdown>
                </div>
              )}
            </Flex>

            {postData && (
              <Flex gap={12} align="center" className="mt-4">
                <Avatar>
                  {postData?.author?.fullName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div>
                  <Typography.Text>
                    {postData?.author?.fullName}
                  </Typography.Text>
                  <div style={{ color: "#878384", fontSize: 12 }}>
                    {timeAgo.format(new Date(postData?.createdAt as string))}
                  </div>
                </div>
              </Flex>
            )}

            <div
              className="mt-10"
              style={{
                borderBottom: "1px solid #e7e7e7",
                paddingBottom: 20,
                marginBottom: 20,
              }}
              dangerouslySetInnerHTML={{ __html: postData?.content as string }}
            />

            <div className="flex items-center gap-10">
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  doReaction(postData?._id);
                }}
              >
                {liked ? (
                  <HeartFilled style={{ color: colorPrimary }} />
                ) : (
                  <HeartOutlined />
                )}
                <Typography.Text className="ma-0">
                  {postData?.likes?.length ?? 0} thích
                </Typography.Text>
              </div>
              <div className="flex gap-2 items-center">
                <CommentOutlined />
                <Typography.Text className="ma-0">
                  {postData?.comments?.length ?? 0} bình luận
                </Typography.Text>
              </div>
            </div>
            <div className="mt-3">
              <Typography.Text type="secondary" strong>
                Bình luận
              </Typography.Text>
              <TextArea
                placeholder="Viết bình luận tại đây..."
                className="my-2"
                style={{ minHeight: 80 }}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                allowClear
              />
              <Flex justify="end">
                <Button
                  loading={commentStatus.status === RequestStatus.PENDING}
                  disabled={!comment}
                  type="primary"
                  onClick={() => {
                    doComment({
                      postId: postData?._id,
                      content: comment,
                    });
                  }}
                >
                  Gửi bình luận
                </Button>
              </Flex>
            </div>
            <div className="mt-8 flex flex-col gap-6">
              {commentsLevel1?.map((item: any) => (
                <CommentCard
                  set={setPostData}
                  postId={postData?._id as string}
                  key={item?._id}
                  data={item}
                  replies={postData?.comments.filter(
                    (cmt: any) => cmt?.root == item?._id
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </Col>
      <Col span={7}></Col>
    </Row>
  );
}
