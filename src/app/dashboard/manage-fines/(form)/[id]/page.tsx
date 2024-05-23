"use client";

import ModalDetailInfo from "@/app/dashboard/components/ModalDetailInfo";
import UserRole from "@/components/shared/UserRole";
import { Book } from "@/lib/models/book.model";
import { Borrow, BorrowStatus } from "@/lib/models/borrow.model";
import { toast } from "@/lib/utils/toast";
import { Button, Card, Flex, Image, Modal, Spin, Typography } from "antd";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import {
  getBorrowDetailAction,
  returnBookAction,
} from "@/app/dashboard/manage-borrows/action";
import Status from "@/app/dashboard/manage-borrows/components/BorrowStatus";
import "@/app/dashboard/manage-borrows/(form)/[id]/style.css";

export default function BorrowDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [state, getBorrowDetail] = useFormState(getBorrowDetailAction, {
    data: undefined,
    success: false,
    message: "",
  });

  useEffect(() => {
    getBorrowDetail(id as string);
  }, []);

  const [returnState, returnBook] = useFormState(returnBookAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    toast(returnState);
    if (returnState?.success) {
      router.push(`/dashboard/manage-borrows`);
    }
  }, [returnState]);

  if (!state?.data) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin />
      </div>
    );
  }

  const user: Account | undefined = state?.data?.borrowRecord?.user;
  const borrowRecord: Borrow = state?.data?.borrowRecord;
  const book: Book | undefined = state?.data?.borrowRecord?.book;
  const analysis = state?.data?.analysis;

  return (
    <Card
      className="h-full ma-auto borow-info"
      style={{ maxWidth: 1024 }}
      bodyStyle={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div style={{ flex: 1 }}>
        <Flex align="center" justify="space-between">
          <Typography.Title level={4} className="ma-0">
            Thông tin lượt mượn
          </Typography.Title>

          <Status data={borrowRecord} />
        </Flex>
        <Flex gap={20} className="mt-6">
          <Image
            preview={false}
            style={{
              width: 200,
              aspectRatio: "3/4",
              objectFit: "cover",
              // boxShadow: "1px solid #ccc",
              boxShadow:
                "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
            }}
            src="/images/user.jpg"
          />
          <div style={{ flex: 1 }}>
            <Typography.Title className="ma-0 mb-4" level={4}>
              Bạn đọc: {user?.fullName}
            </Typography.Title>
            <Flex gap={64}>
              <ModalDetailInfo
                title={false}
                records={[
                  {
                    fieldName: "Vai trò",
                    value: <UserRole role={user?.role} />,
                  },
                  { fieldName: "SĐT", value: borrowRecord.phoneNumber },
                  { fieldName: "Email", value: borrowRecord.email },
                  { fieldName: "Địa chỉ", value: borrowRecord.address },
                ]}
              />
              <ModalDetailInfo
                title={false}
                records={[
                  { fieldName: "Sách đã mượn", value: analysis.total },
                  { fieldName: "Sách đang mượn", value: analysis.borrowing },
                  { fieldName: "Sách đã trả", value: analysis.returned },
                  { fieldName: "Số lần quá hẹn", value: analysis.overdued },
                ]}
              />
            </Flex>
          </div>
        </Flex>
        <Flex gap={20} className="mt-16">
          <Image
            preview={false}
            style={{
              width: 200,
              aspectRatio: "3/4",
              objectFit: "cover",
              // border: "1px solid #ccc",
              boxShadow:
                "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
            }}
            src={
              !!state?.data?.borrowRecord?.book?.picture
                ? state?.data?.borrowRecord?.book?.picture
                : "/images/default-book.png"
            }
          />
          <div style={{ flex: 1 }}>
            <Typography.Title className="ma-0 mb-4" level={4}>
              Sách: {book?.name}
            </Typography.Title>
            <ModalDetailInfo
              title={false}
              records={[
                { fieldName: "Mã sách", value: book?.bookID },
                {
                  fieldName: "Thời gian",
                  value: `${dayjs(borrowRecord?.borrowDate).format(
                    "DD/MM/YYYY"
                  )} đến ${dayjs(borrowRecord?.returnDate).format(
                    "DD/MM/YYYY"
                  )}`,
                },
                { fieldName: "Thư viện", value: book?.bookcase?.library?.name },
                { fieldName: "Ghi chú", value: borrowRecord?.note },
              ]}
            />
          </div>
        </Flex>
      </div>

      {borrowRecord?.status === BorrowStatus.BORROWING && (
        <Flex gap={4} justify="flex-end">
          <Button
            onClick={() => {
              router.push(`/dashboard/manage-borrows/update/${id}`);
            }}
          >
            Sửa thông tin
          </Button>
          <Button
            onClick={() => {
              Modal.confirm({
                title: "Hành động này không thể hoàn tác!",
                content: `Hoàn thành lượt mượn ${book?.name}`,
                okText: "Xác nhận",
                cancelText: "Hủy",
                onOk: () => {
                  returnBook(borrowRecord._id);
                },
              });
            }}
          >
            Trả sách
          </Button>
        </Flex>
      )}
    </Card>
  );
}