import { Request } from "express";
import { FieldValidationError, validationResult } from "express-validator";

export default function getCustomValidationResults(request: Request) {
  const errors = validationResult(request);
  if (errors.isEmpty()) return false;

  return errors
    .array({ onlyFirstError: true })
    .reduce((previousErrors, currentError) => {
      const typedValue = currentError as FieldValidationError;

      return {
        ...previousErrors,
        [typedValue.path]: typedValue.msg,
      };
    }, {});
}
