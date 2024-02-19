import { authCheck, fetchAuthToken } from "./authHelper";
import { useDispatch } from "react-redux";
import { flush } from "../store/redux/Identity";

export const buildFormData = (formData, data, parentKey) => {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else {
    const value = data == null ? "" : data;

    formData.append(parentKey, value);
  }
};

export const generateRequestHeader = (customHeader = {}) => {
  let headerObj = {
    Accept: "application/json",
  };

  if (customHeader) {
    headerObj = { ...headerObj, ...customHeader };
  }

  const header = new Headers(headerObj);

  if (authCheck()) {
    header.append("Authorization", fetchAuthToken());
  }

  return header;
};

export const makeRequest = (
  requestUrl,
  requestType = "GET",
  requestBody = null,
  requestHeader = null
) => {
  const fetchOptions = {
    method: requestType,
    headers: generateRequestHeader(),
  };

  if (requestHeader) {
    fetchOptions.headers = generateRequestHeader(requestHeader);
  }

  if (requestBody) {
    if (requestBody instanceof FormData) {
      fetchOptions.body = requestBody;
    } else if (typeof requestBody === "object") {
      if (Object.keys(requestBody).length > 0) {
        const formData = new FormData();
        // buildFormData(formData, requestBody);
        for (const requestBodyKey in requestBody) {
          if (Array.isArray(requestBody[requestBodyKey])) {
            for (let i = 0; i < requestBody[requestBodyKey].length; i++) {
              if (typeof requestBody[requestBodyKey][i] === "object") {
                formData.append(
                  requestBodyKey,
                  JSON.stringify(requestBody[requestBodyKey][i])
                );
              } else {
                formData.append(requestBodyKey, requestBody[requestBodyKey][i]);
              }
            }
          } else {
            formData.append(requestBodyKey, requestBody[requestBodyKey]);
          }
        }
        fetchOptions.body = formData;
      }
    }
  }

  return new Promise((resolve, reject) =>
    fetch(requestUrl, fetchOptions)
      .then((response) => response.json())
      .then((responseData) => {
        switch (responseData.code) {
          case "AUF":
            useDispatch()(flush());
            return resolve({
              status: "fail",
              code: "AUF",
              message: "You have been logged out!",
              errors: {},
            });
          default:
            return resolve(responseData);
        }
      })
      .catch((err) =>
        resolve({
          status: "fail",
          code: "ERR",
          message: "Something went wrong!",
          errors: {},
        })
      )
  );
};
