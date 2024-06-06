import { z } from "zod";

export const createBorrowValidationSchema = z.object({
  book: z.string({
    required_error: "book is missing",
  }),
  library: z.string({
    required_error: "library is missing",
  }),
  phoneNumber: z.string({
    required_error: "phoneNumber is missing",
  }),
  borrowDate: z.string({
    required_error: "borrowDate is missing",
  }),
  returnDate: z.string({
    required_error: "returnDate is missing",
  }),
  email: z.string({
    required_error: "email is missing",
  }),
  address: z.string({
    required_error: "address is missing",
  }),
});
