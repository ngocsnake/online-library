import { FormAction } from "@/constants/app.constant";
import PostForm from "../components/PostForm";

export default function CreatePost() {
  return <PostForm action={FormAction.CREATE} />;
}
