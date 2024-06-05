import { SessionContext } from "@/components/shared/SessionContext";
import { IComment } from "@/lib/models/comment.model";
import { Avatar, Button, Dropdown, Flex, Modal, Typography, theme } from "antd";
import TimeAgo from "javascript-time-ago";
import vi from "javascript-time-ago/locale/vi";
import { useContext, useEffect, useState } from "react";

import useRequest, { RequestStatus } from "@/lib/hooks/useRequest";
import { postService } from "@/lib/services/post.service";
import {
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { toast } from "@/lib/utils/toast";
import Link from "next/link";

TimeAgo.addDefaultLocale(vi);

const timeAgo = new TimeAgo("vi-VN");

export default function CommentCard({
  data,
  postId,
  replies,
  set,
}: {
  data: any;
  postId: string;
  replies?: any[];
  set: any;
}) {
  const [doComment, commentStatus] = useRequest(postService.comment);
  const [deleteComment, deleteStatus] = useRequest(postService.deleteComment);
  const [doReactionComment, reactionCommentStatus] = useRequest(
    postService.reactionComment
  );

  const [openReply, setOpenReply] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const { account } = useContext(SessionContext);
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const liked = !!data.likes?.find(
    (item: any) =>
      item?.toString() === account?._id || item._id === account?._id
  );

  useEffect(() => {
    if (commentStatus.status === RequestStatus.FULFILLED) {
      setReplyContent("");
      setOpenReply("");
      set(commentStatus.data?.data);
    }
  }, [commentStatus.status]);

  useEffect(() => {
    toast(deleteStatus.data);
    if (deleteStatus.status === RequestStatus.FULFILLED) {
      set(deleteStatus.data?.data);
    }
  }, [deleteStatus.status]);

  useEffect(() => {
    if (reactionCommentStatus.status === RequestStatus.FULFILLED) {
      set(reactionCommentStatus.data);
    }
  }, [reactionCommentStatus.status]);

  return (
    <div>
      <div
        style={{
          backgroundColor: "#F2F4F7",
          padding: 12,
          borderRadius: 6,
          position: "relative",
        }}
      >
        {data.author._id === account?._id && (
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    icon: <DeleteOutlined />,
                    label: "Xóa bình luận",
                    key: "delete",
                    onClick: () => {
                      Modal.confirm({
                        title: "Hành động này không thể hoàn tác!",
                        content: `Xác nhận xóa bình luận`,
                        okText: "Xóa",
                        cancelText: "Hủy",
                        onOk: () => {
                          deleteComment({ postId, commentId: data._id });
                        },
                      });
                    },
                  },
                ],
              }}
            >
              <Button type="text" shape="circle">
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          </div>
        )}
        <Flex gap={12} align="center">
          <Avatar>{data.author?.fullName?.charAt(0)?.toUpperCase()}</Avatar>
          <div>
            <Link href={`/forums/author/${data.author?._id}`}>
              <Typography.Text>{data.author?.fullName}</Typography.Text>
            </Link>
            <div style={{ color: "#878384", fontSize: 12 }}>
              {timeAgo.format(new Date(data.createdAt))}
            </div>
          </div>
        </Flex>
        <div className="mt-4">{data.content}</div>
        <Flex className="mt-3 gap-8">
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              doReactionComment(postId, data._id);
            }}
          >
            {liked ? (
              <HeartFilled style={{ color: colorPrimary }} />
            ) : (
              <HeartOutlined />
            )}
            <Typography.Text className="ma-0">
              {data?.likes?.length ?? 0}
            </Typography.Text>
          </div>
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpenReply((prev) => (!prev ? (data._id as string) : ""));
            }}
          >
            <MessageOutlined />
            <Typography.Text className="ma-0">
              {replies?.length ?? 0}
            </Typography.Text>{" "}
            • Trả lời
          </div>
        </Flex>
        {openReply === data._id && (
          <div className="mt-4">
            <TextArea
              value={replyContent}
              onChange={(e) => {
                setReplyContent(e.target.value);
              }}
              placeholder={`Trả lời ${data.author.fullName}`}
              allowClear
            />
            <Flex className="mt-2 gap-2 justify-end">
              <Button
                onClick={() => {
                  setOpenReply("");
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                disabled={!replyContent}
                onClick={() => {
                  doComment({
                    postId,
                    content: replyContent,
                    parent: data._id,
                    root: data._id,
                  });
                }}
                loading={commentStatus.status === RequestStatus.PENDING}
              >
                Gửi
              </Button>
            </Flex>
          </div>
        )}
      </div>
      {replies && replies?.length > 0 && (
        <div className="flex">
          <div
            style={{
              width: 20,
              borderRight: "1px solid #c7c7c7",
            }}
          />
          <div className="w-full flex flex-col gap-6 mt-3">
            {replies?.map((item, index) => {
              const liked = !!item.likes?.find(
                (item: any) =>
                  item?.toString() === account?._id || item._id === account?._id
              );
              return (
                <Flex align="center" className="relative">
                  <div
                    className="absolute"
                    style={{
                      height: 40,
                      borderBottom: "1px solid #c7c7c7",
                      borderLeft: "1px solid #c7c7c7",
                      width: 20,
                      borderBottomLeftRadius: 4,
                      bottom: "50%",
                      left: -1,
                    }}
                  />
                  {item.author._id === account?._id && (
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <Dropdown
                        trigger={["click"]}
                        menu={{
                          items: [
                            {
                              icon: <DeleteOutlined />,
                              label: "Xóa bình luận",
                              key: "delete",
                              onClick: () => {
                                Modal.confirm({
                                  title: "Hành động này không thể hoàn tác!",
                                  content: `Xác nhận xóa bình luận`,
                                  okText: "Xóa",
                                  cancelText: "Hủy",
                                  onOk: () => {
                                    deleteComment({
                                      postId,
                                      commentId: item._id,
                                    });
                                  },
                                });
                              },
                            },
                          ],
                        }}
                      >
                        <Button type="text" shape="circle">
                          <EllipsisOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                  )}
                  {index === replies.length - 1 && (
                    <div
                      className="absolute"
                      style={{
                        height: "calc(50% + 4px)",
                        width: 1,
                        top: "calc(50% - 2px)",
                        left: -1,
                        backgroundColor: "white",
                      }}
                    />
                  )}
                  <div
                    style={{
                      backgroundColor: "#F2F4F7",
                      padding: 12,
                      borderRadius: 6,
                      flex: 1,
                      marginLeft: 20,
                    }}
                  >
                    <Flex gap={12} align="center">
                      <Avatar>
                        {item.author?.fullName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <div>
                        <Link href={`/forums/author/${item.author?._id}`}>
                          <Typography.Text>
                            {item.author?.fullName}
                          </Typography.Text>
                        </Link>
                        <div style={{ color: "#878384", fontSize: 12 }}>
                          {timeAgo.format(new Date(item.createdAt))}
                        </div>
                      </div>
                    </Flex>
                    <div className="mt-4">{item.content}</div>
                    <Flex className="mt-3 gap-6">
                      <div
                        className="flex gap-2 items-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          doReactionComment(postId, item._id);
                        }}
                      >
                        {liked ? (
                          <HeartFilled style={{ color: colorPrimary }} />
                        ) : (
                          <HeartOutlined />
                        )}
                        <Typography.Text className="ma-0">
                          {item?.likes?.length ?? 0}
                        </Typography.Text>
                      </div>
                      <div
                        className="flex gap-2 items-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenReply((prev) =>
                            prev === item?._id ? "" : (item._id as string)
                          );
                        }}
                      >
                        <MessageOutlined />
                        <Typography.Text className="ma-0">
                          {
                            replies?.filter(
                              (cmt: any) => cmt.parent === item._id
                            ).length
                          }
                        </Typography.Text>
                      </div>
                    </Flex>
                    {openReply === item._id && (
                      <div className="mt-4">
                        <TextArea
                          value={replyContent}
                          onChange={(e) => {
                            setReplyContent(e.target.value);
                          }}
                          placeholder={`Trả lời ${item.author.fullName}`}
                          allowClear
                        />
                        <Flex className="mt-2 gap-2 justify-end">
                          <Button
                            onClick={() => {
                              setOpenReply("");
                            }}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="primary"
                            disabled={!replyContent}
                            onClick={() => {
                              doComment({
                                postId,
                                content: replyContent,
                                parent: item._id,
                                root: data._id,
                              });
                            }}
                            loading={
                              commentStatus.status === RequestStatus.PENDING
                            }
                          >
                            Gửi
                          </Button>
                        </Flex>
                      </div>
                    )}
                  </div>
                </Flex>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
