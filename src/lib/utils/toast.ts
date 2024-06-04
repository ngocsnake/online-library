import { message as messageAntd } from "antd";
export const toast = (data: { success?: boolean; message?: string }) => {
  const message = data?.message;
  const success = data?.success;

  if (message) {
    messageAntd[success ? "success" : "error"](message);
  }
};
