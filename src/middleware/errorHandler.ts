import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/responseApi";
import { Prisma } from "@prisma/client";
const handlePrismaError = (err: any) => {
  switch (err.code) {
    case "P2002":
      // handling duplicate key errors
      return apiResponse(
        `Duplicate field value: ${err.meta.target}`,
        400,
        "Error",
        null
      );
    case "P2014":
      // handling invalid id errors
      return apiResponse(`Invalid ID: ${err.meta.target}`, 400, "Error", null);
    case "P2003":
      // handling invalid data errors
      return apiResponse(
        `Invalid input data: ${err.meta.target}`,
        400,
        "Error",
        null
      );
    default:
      // handling all other errors
      return apiResponse(
        `Something went wrong: ${err.message}`,
        500,
        "Error",
        null
      );
  }
};
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  //   let error = { ...err };

  //   error.message = err.message;
  //   if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //     console.log("handlePrismaError");
  //     error = handlePrismaError(err);
  //   }
  const response = apiResponse(err.message, 500, "error", null);
  res.status(500).json(response);
}
