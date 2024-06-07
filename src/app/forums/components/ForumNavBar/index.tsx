import { SessionContext } from "@/components/shared/SessionContext";
import { RoleEnum } from "@/lib/models/account.model";
import { Typography } from "antd";
import Link from "next/link";
import { useContext } from "react";

export default function ForumNavBar() {
  const { account } = useContext(SessionContext);

  return (
    <div className="flex justify-end">
      <div className="flex flex-col gap-4">
        <Typography.Title level={5} type="secondary">
          Hoạt động của tôi
        </Typography.Title>
        <Link href={`/forums`}>
          <Typography.Text style={{ fontSize: 15 }}>Trang chủ</Typography.Text>
        </Link>
        <Link href={`/forums/author/${account?._id}`}>
          <Typography.Text style={{ fontSize: 15 }}>
            Bài viết của tôi
          </Typography.Text>
        </Link>
        <Link href={`/forums/liked`}>
          <Typography.Text style={{ fontSize: 15 }}>
            Bài viết yêu thích
          </Typography.Text>
        </Link>
        {account?.role !== RoleEnum.USER && (
          <div className="flex flex-col gap-4 mt-6">
            <Typography.Title level={5} type="secondary">
              Quản trị
            </Typography.Title>
            <Link href={`/forums/pending`}>
              <Typography.Text style={{ fontSize: 15 }}>
                Bài viết chờ duyệt
              </Typography.Text>
            </Link>
            {/* <Typography.Text style={{ fontSize: 15 }}>
              Bài viết đã hủy
            </Typography.Text> */}
          </div>
        )}
      </div>
    </div>
  );
}
