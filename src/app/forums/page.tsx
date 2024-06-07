"use client";

import ForumHeader from "@/app/forums/components/ForumHeader";
import useApiRequest from "@/lib/hooks/useApiRequest";
import { postService } from "@/lib/services/post.service";
import { Card, Col, Pagination, Row, Skeleton } from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ForumNavBar from "./components/ForumNavBar";
import PostCard from "./components/PostCard";

export default function ForumPage({ author }: any) {
  const [doGet, { data, loading }] = useApiRequest(postService.get);
  const [current, setCurrent] = useState(1);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("query");
    doGet({ query, author: author, limit: 20, page: current });
  }, [pathname, searchParams, current]);

  useEffect(() => {
    setCurrent(data?.page);
  }, [data]);

  return (
    <div className="h-full">
      <ForumHeader
        author={author ? data?.docs?.[0]?.author : undefined}
        totalDocs={data?.totalDocs}
        onFinish={doGet}
      />
      <Row className="h-full" gutter={48} style={{ overflow: "hidden" }}>
        <Col span={7} style={{ borderRight: "1px solid #e7e7e7" }}>
          <ForumNavBar />
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

                <Pagination
                  className="mt-4"
                  current={current}
                  onChange={setCurrent}
                  pageSize={data?.limit}
                  total={data?.totalDocs}
                />
              </div>
            )}
          </div>
        </Col>
        <Col span={7}></Col>
      </Row>
    </div>
  );
}
