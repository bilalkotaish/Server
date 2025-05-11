import { sendEmail } from "./emailservice.js";

const sendEmailFun = async ({ sendTo, subject, text, html }) => {
  const result = await sendEmail({ to: sendTo, subject, text, html });
  return result.success;
};

export default sendEmailFun;
