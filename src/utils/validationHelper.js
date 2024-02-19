import validator from "validator";

const validatorRule = (value, validationKeyword) => {
  let validation = { status: true, message: "" };
  switch (true) {
    case /required/i.test(validationKeyword):
      validation.status = !validator.isEmpty(value, {
        ignore_whitespace: true,
      });
      validation.message =
        validation.status === false ? "The value is required!" : "";
      break;
    case /float/i.test(validationKeyword):
      if (value !== "") {
        validation.status = validator.isFloat(value);
        validation.message =
          validation.status === false ? "The value needs to be a float!" : "";
      }
      break;
    case /email/i.test(validationKeyword):
      if (value !== "") {
        validation.status = validator.isEmail(value);
        validation.message =
          validation.status === false ? "The value needs to be an Email!" : "";
      }
      break;
    case /alpha/i.test(validationKeyword):
      if (value !== "") {
        validation.status = validator.isAlpha(value, "en-US", { ignore: " " });
        validation.message =
          validation.status === false
            ? "The value needs to be only Alphabetic!"
            : "";
      }
      break;
    case /alphanumeric/i.test(validationKeyword):
      if (value !== "") {
        validation.status = validator.isAlphanumeric(value, "en-US", {
          ignore: " ",
        });
        validation.message =
          validation.status === false
            ? "The value needs to be AlphaNumeric!"
            : "";
      }
      break;
    case /numeric/i.test(validationKeyword):
      if (value !== "") {
        validation.status = validator.isNumeric(value);
        validation.message =
          validation.status === false
            ? "The value needs to be only Numeric!"
            : "";
      }
      break;
    case /equals:*/i.test(validationKeyword):
      if (value !== "") {
        const valData = validationKeyword.split(":");
        validation.status = validator.equals(value, valData[2]);
        validation.message =
          validation.status === false
            ? `The value needs to be same as ${valData[1]}!`
            : "";
      }
      break;
    default:
      validation.status = true;
      validation.message = "";
      break;
  }
  return validation;
};

export const validate = (inputvalue, validationRules = []) => {
  const validationResult = {
    status: true,
    message: "",
  };
  validationRules.forEach((validationRule) => {
    const runningValidation = validatorRule(inputvalue, validationRule);
    validationResult.status =
      validationResult.status && runningValidation.status;
    validationResult.message += " " + runningValidation.message;
    validationResult.message = validationResult.message.trim();
  });
  return validationResult;
};
