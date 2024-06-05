import { SessionContext } from "@/components/shared/SessionContext";
import useRequest, { RequestStatus } from "@/lib/hooks/useRequest";
import { RoleEnum } from "@/lib/models/account.model";
import { IPost } from "@/lib/models/post.model";
import { postService } from "@/lib/services/post.service";
import { extractHashtags, removeHashtags } from "@/lib/utils/hashtag";
import {
  CommentOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  HeartFilled,
  HeartOutlined,
  LineOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Flex,
  MenuProps,
  Modal,
  Typography,
  message,
  theme,
} from "antd";
import TimeAgo from "javascript-time-ago";
import vi from "javascript-time-ago/locale/vi";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
TimeAgo.addDefaultLocale(vi);

export default function PostCard({ item }: { item: any }) {
  const { account } = useContext(SessionContext);
  const [post, setPost] = useState(item);
  const [doDelete, deleteStatus] = useRequest(postService.delete);
  const [doReaction, reactionStatus] = useRequest(postService.reaction);
  const [doPin, pinStatus] = useRequest(postService.pin);

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const timeAgo = new TimeAgo("vi-VN");
  const hashtag = extractHashtags(post.title);

  const items: MenuProps["items"] = [];

  // if (account?.role !== RoleEnum.USER && post.author._id === account?._id) {
  //   items.push({
  //     icon: <EditOutlined />,
  //     label: "Chỉnh sửa bài viết",
  //     key: "edit",
  //   });
  // }

  if (account?.role !== RoleEnum.USER) {
    items.push({
      icon: post.pin ? <LineOutlined /> : <PushpinOutlined />,
      label: post.pin ? "Bỏ ghim bài viết" : "Ghim bài viết",
      key: "pin",
      onClick: () => {
        doPin(post._id);
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
          doDelete(post._id);
        },
      });
    },
  });

  useEffect(() => {
    if (reactionStatus.status === RequestStatus.FULFILLED) {
      setPost(reactionStatus.data);
    }
  }, [reactionStatus.status]);

  useEffect(() => {
    if (pinStatus.status === RequestStatus.FULFILLED) {
      setPost(pinStatus.data);
    }
  }, [pinStatus.status]);

  useEffect(() => {
    if (deleteStatus.status === RequestStatus.FULFILLED) {
      message.success("Đã xóa bài viết");
    }
  }, [deleteStatus.status]);

  const liked = !!post?.likes?.find(
    (item: any) =>
      item?.toString() === account?._id || item._id === account?._id
  );

  return (
    !deleteStatus.data?.success && (
      <div>
        <Card key={post._id} className="sticky post-card">
          {(account?.role === RoleEnum.ADMIN ||
            account?._id === post?.author?._id) && (
            <div
              style={{ position: "absolute", right: 12, top: 12 }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {post.pin && <PushpinOutlined />}

              <Dropdown menu={{ items }} trigger={["click"]}>
                <Button type="text" shape="circle">
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            </div>
          )}
          <Flex gap={12} align="center">
            <Avatar>{post.author?.fullName?.charAt(0)?.toUpperCase()}</Avatar>
            <div>
              <Link href={`/forums/author/${post.author?._id}`}>
                <Typography.Text>{post.author?.fullName}</Typography.Text>
              </Link>
              <div style={{ color: "#878384", fontSize: 12 }}>
                {timeAgo.format(new Date(post.createdAt as string))}
              </div>
            </div>
          </Flex>
          <Link href={`/forums/${post._id}`}>
            <div style={{ color: "black" }}>
              <div className="mt-2">
                <Typography.Title level={5}>
                  {removeHashtags(post.title)}
                </Typography.Title>
              </div>
              <div
                className="my-2 max-2-lines post-card-body"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </Link>
          <Flex justify="space-between" style={{ marginBottom: -6 }}>
            <div className="flex items-center gap-4">
              {hashtag.map((item, index) => (
                <Link
                  key={index}
                  href={`/forums?query=${item.replace(/#/g, "%23")}`}
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-10">
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  doReaction(post._id);
                }}
              >
                {liked ? (
                  <HeartFilled style={{ color: colorPrimary }} />
                ) : (
                  <HeartOutlined />
                )}
                <Typography.Text className="ma-0">
                  {post?.likes?.length ?? 0}
                </Typography.Text>
              </div>
              <div className="flex gap-2 items-center">
                <CommentOutlined />
                <Typography.Text className="ma-0">
                  {post?.comments?.length ?? 0}
                </Typography.Text>
              </div>
            </div>
          </Flex>
        </Card>
      </div>
    )
  );
}
