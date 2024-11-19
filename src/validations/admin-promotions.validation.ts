import dayjs from "dayjs";
import { body } from "express-validator";

export const createPromotion = () => [
  body("name", "Name is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true }),
  body("price", "Price is required")
    .notEmpty({ ignore_whitespace: true })
    .isNumeric({ no_symbols: true })
    .withMessage("Price must not have any symbols")
    .bail()
    .custom((value) => {
      if (value > 500) throw "Price must be less than 500";
      return true;
    }),
  body("startDate", "Start date is required")
    .notEmpty({ ignore_whitespace: true })
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage("Start date must be a valid ISO 8601 date")
    .bail()
    .custom((value) => dayjs().isBefore(dayjs(value)))
    .withMessage("Start date must be in future"),
  body("endDate", "End date is required")
    .notEmpty({ ignore_whitespace: true })
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage("End date must be a valid ISO 8601 date")
    .bail()
    .custom((value, { req }) => dayjs(value).isAfter(dayjs(req.body.startDate)))
    .withMessage("End date must after start date"),
];
