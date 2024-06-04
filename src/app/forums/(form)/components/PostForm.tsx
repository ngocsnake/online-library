"use client";

import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.scss";
import { FormAction } from "@/constants/app.constant";
import { Button, Input, Typography } from "antd";
import { IPost, PostDocument } from "@/lib/models/post.model";
import { useRouter } from "next/navigation";
import useApiRequest from "@/lib/hooks/useApiRequest";
import { postService } from "@/lib/services/post.service";
import { toast } from "@/lib/utils/toast";

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "bullet" }],
    [{ list: "ordered" }],
    ["image", "link", "code"],
  ],
};

interface FormProps {
  action: FormAction;
  onFinish?: () => void;
}

export default function PostForm(props: FormProps) {
  const { action, onFinish } = props;
  const [doCreate, createStatus] = useApiRequest(postService.create);

  const [post, setPost] = useState<Partial<IPost>>({});

  const setState = (key: string, value: string) => {
    setPost((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSubmit = async () => {
    if (action === FormAction.CREATE) {
      await doCreate(post);
      toast(createStatus.data)
      onFinish && onFinish();
      setState("title", "");
      setState("content", "");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Input
        placeholder="Nhập tiêu đề bài viết #post #tag..."
        style={{
          border: "none",
          marginTop: 24,
          fontSize: 20,
          padding: "8px 16px",
        }}
        value={post.title}
        onChange={(e) => {
          setState("title", e.target.value);
        }}
      />
      <ReactQuill
        placeholder="Nhập nội dung bài viết..."
        theme="snow"
        value={post.content}
        onChange={(e) => {
          setState("content", e);
        }}
        modules={modules}
        preserveWhitespace
        className="post-content"
        style={{ backgroundColor: "white" }}
      />
      <Button
        className="mt-4"
        style={{ marginBottom: -8 }}
        onClick={onSubmit}
        type="primary"
        loading={createStatus.loading}
        disabled={
          !post.title ||
          (post.content?.includes("img")
            ? false
            : !post.content?.replace(/(<([^>]+)>)/gi, ""))
        }
      >
        Đăng bài
      </Button>
    </div>
  );
}
