"use client";

import { Button, Flex, Form, Input, Typography } from "antd";

export default function RemoveAccount() {
  return (
    <div
      style={{
        maxWidth: 1176,
        margin: "84px auto 0 auto",
        padding: "60px 12px",
      }}
    >
      <Typography.Title level={3}>Remove account</Typography.Title>
      <Typography.Text>
        This action will remove all of your database information. This cannot be
        undone.
      </Typography.Text>
      <Flex gap={8} align="center" className="mt-4">
        <Input placeholder="Enter your email..." />
        <Button type="primary">Remove account</Button>
      </Flex>
    </div>
  );
}
