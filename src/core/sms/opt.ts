import axios, { AxiosError, AxiosRequestConfig } from "axios";
import envConfig from "../config/env.config";

interface SmsResponse {
    requestId: string;
    type: "error" | string;
    message?: string;
}

const { smsApiKey, smsWidgetId } = envConfig;

function getPhoneIdentifier(phone: string) {
    const digits = phone.replace(/\D/g, "");
    return digits.startsWith("91") ? digits : `91${digits}`;
}

function getSmsError(error: unknown) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    return (
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unable to send SMS OTP"
    );
}

async function sendSmsOtp(phone: string): Promise<SmsResponse> {
    if (!smsApiKey || !smsWidgetId) {
        return {
            requestId: "",
            type: "error",
            message: "MSG91 SMS_API_KEY or SMS_WIDGET_ID is not configured",
        };
    }

    const options: AxiosRequestConfig = {
        method: "POST",
        url: "https://api.msg91.com/api/v5/widget/sendOtp",
        headers: {
            "content-type": "application/json",
            authkey: smsApiKey,
        },
        data: JSON.stringify({
            widgetId: smsWidgetId,
            identifier: getPhoneIdentifier(phone),
        }),
    };

    try {
        const {
            data: { message: requestId, type },
        } = await axios.request(options);
        console.log("SMS OTP sent successfully:", requestId, type);
        return { requestId, type } as SmsResponse;
    } catch (error) {
        const message = getSmsError(error);
        console.error("Error sending SMS OTP:", message);
        return { requestId: "", type: "error", message };
    }
}

async function verifySmsOtp(requestId: string, otp: string) {
    const options: AxiosRequestConfig = {
        method: "POST",
        url: "https://api.msg91.com/api/v5/widget/verifyOtp",
        headers: {
            "content-type": "application/json",
            authkey: smsApiKey,
        },
        data: JSON.stringify({
            widgetId: smsWidgetId,
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
        return { requestId: "", type: "error", message: getSmsError(error) };
    }
}

async function reterySmsOtp(requestId: string): Promise<SmsResponse> {
    const options: AxiosRequestConfig = {
        method: "POST",
        url: "https://api.msg91.com/api/v5/widget/retryOtp",
        headers: {
            "content-type": "application/json",
            authkey: smsApiKey,
        },
        data: JSON.stringify({
            widgetId: smsWidgetId,
            reqId: requestId,
        }),
    };

    try {
        const {
            data: { message: requestId, type },
        } = await axios.request(options);

        return { requestId, type } as SmsResponse;
    } catch (error) {
        return { requestId: "", type: "error", message: getSmsError(error) };
    }
}

export { sendSmsOtp, verifySmsOtp, reterySmsOtp };
