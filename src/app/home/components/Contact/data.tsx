import {Home, Mail, PhoneCall} from "@/components/icons";

export const contacts = [
  {
    id: 1,
    title: "Cơ sở Đại La: ",
    description: "Số 107, khu tập thể A5, ngõ 128C Đại La",
    type: "address",
    icon: <Home/>,
  },
  {
    id: 2,
    title: "Cơ sở Cầu Giấy: ",
    description: "Số 2 ngõ Viện Máy, đường Phạm Văn Đồng",
    icon: <Home/>,
    type: "address"
  },
  {
    id: 3,
    title: "Email",
    description: "thuviendfb@gmail.com",
    icon: <Mail/>,
    type: "email"
  },
  {
    id: 4,
    title: "Điện thoại",
    description: "0962.188.248 (Đại La) / 0986.689.024 (Cầu Giấy)",
    icon: <PhoneCall/>,
    type: "phoneNumber"
  },
  {
    id: 5,
    title: "Điện thoại",
    description: "0979.745.256 - Nguyễn Thành Nam - Quản trị viên",
    icon: <PhoneCall/>,
    type: "phoneNumber"
  }
];