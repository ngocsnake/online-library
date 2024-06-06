"use client";

import ForumHeader from "@/app/forums/components/ForumHeader";
import { SessionContext } from "@/components/shared/SessionContext";
import useApiRequest from "@/lib/hooks/useApiRequest";
import { RoleEnum } from "@/lib/models/account.model";
import { postService } from "@/lib/services/post.service";
import { Card, Col, Row, Skeleton, Typography } from "antd";
import { useContext, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import PostCard from "../components/PostCard";

export default function PendingPage() {
  const author = undefined;
  const { account } = useContext(SessionContext);
  const [doGet, { data, loading }] = useApiRequest(postService.getLiked);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("query");
    doGet({ query, author: author });
  }, [pathname, searchParams]);

  return (
    <div className="h-full">
      <ForumHeader
        author={author ? data?.docs?.[0]?.author : undefined}
        totalDocs={data?.totalDocs}
        onFinish={doGet}
      />
      <Row className="h-full" gutter={48} style={{ overflow: "hidden" }}>
        <Col span={7} style={{ borderRight: "1px solid #e7e7e7" }}>
          <div className="flex items-end flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Link href={`/forums/liked`}>
                <Typography.Title level={5} type="secondary">
                  Hoạt động của tôi
                </Typography.Title>
              </Link>
              <Link href={`/forums/author/${account?._id}`}>
                <Typography.Text style={{ fontSize: 15 }}>
                  Bài viết của tôi
                </Typography.Text>
              </Link>
              <Typography.Text style={{ fontSize: 15 }}>
                Bài viết yêu thích
              </Typography.Text>
              {account?.role !== RoleEnum.USER && (
                <div className="flex flex-col gap-4 mt-6">
                  <Typography.Title level={5} type="secondary">
                    Quản trị
                  </Typography.Title>
                  <Typography.Text style={{ fontSize: 15 }}>
                    Bài viết chờ duyệt
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 15 }}>
                    Bài viết đã hủy
                  </Typography.Text>
                </div>
              )}
            </div>
          </div>
        </Col>
        <Col
          span={10}
          className="flex flex-col h-full"
          style={{ overflow: "hidden" }}
        >
          <div style={{ flex: 1, overflow: "auto" }}>
            {loading ? (
              <div className="flex flex-col gap-6">
                <Card>
                  <Skeleton />
                </Card>
                <Card>
                  <Skeleton />
                </Card>
                <Card>
                  <Skeleton />
                </Card>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {data?.docs?.map((item: any) => {
                  return <PostCard item={item} key={item._id} />;
                })}

                {data?.docs?.length === 0 && (
                  <Card className="flex items-center justify-center">
                    Không có dữ liệu.
                  </Card>
                )}
              </div>
            )}
          </div>
        </Col>
        <Col span={7}></Col>
      </Row>
    </div>
  );
}
