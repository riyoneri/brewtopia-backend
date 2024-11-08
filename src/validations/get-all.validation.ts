import { query } from "express-validator";

export default function getAllSanitizer(limit: number = 10) {
  return [
    query("page")
      .custom((value) => Number(value) || 1)
      .optional({ values: "undefined" }),
    query("limit")
      .custom((value) => Number(value) || limit)
      .optional({ values: "undefined" }),
  ];
}
