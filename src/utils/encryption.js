var CryptoJS = require("crypto-js");

export const encrypt = (text) => {
  try {
    var ciphertext = CryptoJS.AES.encrypt(text, '123456').toString();
    return ciphertext;
  } catch (error) {
    return;
  }
}

// Decrypting text
export const decrypt = (text) => {
  try {
    var bytes = CryptoJS.AES.decrypt(text, '123456');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    return;
  }
}