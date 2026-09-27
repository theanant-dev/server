import nodemailer, { SentMessageInfo, SendMailOptions } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import envConfig from '../config/env.config';
import logger from '../logger/winston.logger';
const { emailHost, emailPort, emailUser, emailPass, emailFrom } = envConfig;
export interface OtpTemplateData {
    name: string;
    otp: number | string;
}

export interface WelcomeTemplateData {
    name: string;
    loginUrl: string;
}

// Map template names to their strictly required payload structures
export type TemplateMap = {
    'otp': OtpTemplateData;
    'welcome': WelcomeTemplateData;
};

// 1. Configure SMTP Transport with environment variable type assertion
const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

/**
 * Sends a strictly typed HTML email template
 */
export const sendEmail = async <T extends keyof TemplateMap>(
    to: string,
    subject: string,
    templateName: T,
    data: TemplateMap[T]
): Promise<SentMessageInfo> => {
    try {
        // Resolve path to .ejs template
        const templatePath = path.join(__dirname, `../email/views/emails/${templateName}.ejs`);

        // Render template with type-checked context data
        const html = await ejs.renderFile(templatePath, data);

        const mailOptions: SendMailOptions = {
            from: `"labmitra" <${emailFrom}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        // console.log(info);
        logger.info(`Email sent: ${info.messageId} to ${to} with subject "${subject}"`);
        return info;
    } catch (error) {
        logger.error('Error sending email:', error);
        throw error;
    }
};
