import { BookModel, BookStatus } from "@/lib/models/book.model";
import { BookcaseModel } from "@/lib/models/bookcase.model";
import {
  Borrow,
  BorrowDocument,
  BorrowModel,
  BorrowStatus,
} from "@/lib/models/borrow.model";
import dayjs from "dayjs";
import { FilterQuery } from "mongoose";
import { AccountModel } from "./../models/account.model";
import accountService from "./account.service";
import { bookService } from "./book.service";

class BorrowService {
  async create(payload: any) {
    const book = await bookService.getById(payload.book);
    if (!book || book?.status !== BookStatus.AVAILABLE) {
      throw Error("Sách hiện không khả dụng");
    }

    payload.status = BorrowStatus.BORROWING;

    const borrowRecord = await BorrowModel.create(payload);
    await bookService.update(book._id, {
      status: BookStatus.BORROWING,
      borrowRecord: borrowRecord,
    });
    return JSON.parse(JSON.stringify(borrowRecord));
  }

  async get(page: number, limit: number, query?: any) {
    BookcaseModel.find();

    const existingBookIds = (await BookModel.find({}, "_id")).map(
      (book) => book._id
    );
    const existingUserIds = (await AccountModel.find({}, "_id")).map(
      (account) => account._id
    );

    try {
      const options = {
        page,
        limit,
        populate: [
          {
            path: "user",
            model: "Account",
          },
          {
            path: "library",
            model: "Location",
          },
          {
            path: "book",
            model: "Book",
            populate: {
              path: "bookcase",
              populate: "library",
            },
          },
        ],
        sort: { createdAt: -1 },
      };

      const filter: FilterQuery<BorrowDocument> = {
        book: { $ne: null, $in: existingBookIds },
        user: { $ne: null, $in: existingUserIds },
        isDelete: false,
      };

      if (query?.status == "borrowing") {
        filter.status = "borrowing";
      }

      if (query?.status == "returned") {
        filter.status = "returned";
      }

      if (query?.status == "overdue") {
        filter.status = "overdue";
      }

      if (query.library) {
        filter.library = query.library;
      }

      if (query?.month && query?.year) {
        const startDate = new Date(query.year, query.month - 1, 1);
        const endDate = new Date(query.year, query.month, 0, 23, 59, 59);

        filter.createdAt = { $gte: startDate, $lte: endDate };
      }

      if (query?.overdue){
        filter.returnDate = { $lte: new Date() };
      }

      if (query?.query) {
        const f: any = [{}];
        for (const key in filter) {
          if (key !== "book" && key !== "user") {
            f.push({
              [key]: filter[key],
            });
          }
        }

        const res = (
          await BorrowModel.aggregate([
            {
              $lookup: {
                from: "accounts",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $lookup: {
                from: "books",
                localField: "book",
                foreignField: "_id",
                as: "book",
              },
            },
            {
              $lookup: {
                from: "locations",
                localField: "library",
                foreignField: "_id",
                as: "library",
              },
            },
            {
              $match: {
                $or: [
                  { "book.name": { $regex: new RegExp(query.query, "i") } },
                  { "user.fullName": { $regex: new RegExp(query.query, "i") } },
                ],
                "book._id": { $in: existingBookIds },
                "user._id": { $in: existingUserIds },
                $and: f,
              },
            },
            {
              $facet: {
                metadata: [
                  { $count: "totalDocs" },
                  { $addFields: { page: page, limit: limit } },
                ],
                data: [{ $skip: page * limit - limit }, { $limit: limit }],
              },
            },
          ])
        )[0];

        return JSON.parse(
          JSON.stringify({
            data: res?.data.map((item: any) => ({
              ...item,
              user: item.user[0],
              book: item.book[0],
              library: item.library[0],
            })),
            totalPages: Math.ceil(res?.metadata?.[0]?.totalDocs / limit),
            totalDocs: res?.metadata?.[0]?.totalDocs,
            page,
            limit,
          })
        );
      }

      const result = await (BorrowModel as any).paginate(filter, options);

      return {
        data: JSON.parse(JSON.stringify(result.docs)) as Borrow[],
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        page,
        limit,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteById(_id: string): Promise<void> {
    try {
      await this.update(_id, { isDelete: true });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getById(_id: string): Promise<Borrow | null> {
    try {
      const data = await BorrowModel.findById(_id).populate([
        "user",
        {
          path: "book",
          populate: {
            path: "bookcase",
            populate: "library",
          },
        },
      ]);
      return JSON.parse(JSON.stringify(data));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getDetail(_id: string) {
    try {
      const borrowRecord = await this.getById(_id);
      const user = await accountService.getAccountById(borrowRecord?.user?._id);
      const history = await BorrowModel.find({
        user: user?._id,
        isDelete: false,
      });
      const borrowing = history.filter((item) => {
        return item?.status === BorrowStatus.BORROWING;
      }).length;

      const returned = history.length - borrowing;
      const overdued = history.filter(
        (item) => item?.status === BorrowStatus.OVERDUE
      ).length;

      return JSON.parse(
        JSON.stringify({
          borrowRecord,
          analysis: { total: history.length, borrowing, returned, overdued },
        })
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllByAccount(_id: string) {
    try {
      return BorrowModel.find({ user: _id, isDelete: false }).populate([
        "user",
        {
          path: "book",
          populate: {
            path: "bookcase",
            populate: "library",
          },
        },
      ]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async update(
    _id: string,
    updateData: Partial<Borrow>
  ): Promise<Borrow | null> {
    try {
      const data = await BorrowModel.findByIdAndUpdate(_id, updateData, {
        new: true,
      });
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async returnBook(borrowId: string) {
    try {
      const borrow: any = await this.getById(borrowId);
      const overdued = dayjs().diff(borrow?.returnDate) > 0;
      const result = this.update(borrowId, {
        status: overdued ? BorrowStatus.OVERDUE : BorrowStatus.RETURNED,
        realReturnDate: new Date(),
      });

      const book = await bookService.getById(borrow?.book);
      await bookService.update(book?._id, {
        status: BookStatus.AVAILABLE,
      });

      return JSON.parse(JSON.stringify(result));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllByBookId(bookId: string) {
    const history = await BorrowModel.find({ book: bookId }).populate([
      "user",
      {
        path: "book",
        populate: {
          path: "bookcase",
          populate: "library",
        },
      },
    ]);
    return JSON.parse(JSON.stringify(history));
  }
}

export const borrowService = new BorrowService();
