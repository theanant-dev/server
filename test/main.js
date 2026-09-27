const axios = require("axios");
const envConfig = require("../core/config/env.config.ts");

const { smsApiKey, smsTemplateId } = envConfig;

async function sendSmsOtp(phone) {
  const options = {
    method: "POST",
    url: "https://api.msg91.com/api/v5/widget/sendOtp",
    headers: {
      "content-type": "application/json",
      authkey: smsApiKey,
    },
    data: JSON.stringify({
      widgetId: smsTemplateId,
      identifier: `91${phone}`,
    }),
  };

  try {
    const {
      data: { message: requestId, type },
    } = await axios.request(options);
    return { requestId, type };
  } catch (error) {
    return { requestId: "", type: "error" };
  }
}

async function verifySmsOtp(requestId, otp) {
  const options = {
    method: "POST",
    url: "https://api.msg91.com/api/v5/widget/verifyOtp",
    headers: {
      "content-type": "application/json",
      authkey: smsApiKey,
    },
    data: JSON.stringify({
      widgetId: smsTemplateId,
      reqId: requestId,
      otp: otp,
    }),
  };

  try {
    const {
      data: { message: requestId, type },
    } = await axios.request(options);
    return { requestId, type };
  } catch (error) {
    return { requestId: "", type: "error" };
  }
}

async function reterySmsOtp(requestId) {
  const options = {
    method: "POST",
    url: "https://api.msg91.com/api/v5/widget/retryOtp",
    headers: {
      "content-type": "application/json",
      authkey: smsApiKey,
    },
    data: JSON.stringify({
      widgetId: smsTemplateId,
      reqId: requestId,
    }),
  };

  try {
    const {
      data: { message: requestId, type },
    } = await axios.request(options);

    return { requestId, type };
  } catch (error) {
    return { requestId: "", type: "error" };
  }
}

sendSmsOtp("7372046565").then((res) => console.log("sendSmsOtp", res));
