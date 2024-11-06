import { query } from "express-validator";

export default function getAllSanitizer(limit: number = 10) {
  return [
    query("page").customSanitizer((value) => Number(value) || 1),
    query("limit").customSanitizer((value) => Number(value) || limit),
  ];
}
