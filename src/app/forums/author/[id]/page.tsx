"use client";

import ForumPage from "../../page";

export default function Author({ params }: { params: { id: string } }) {
  return <ForumPage author={params.id} />;
}
