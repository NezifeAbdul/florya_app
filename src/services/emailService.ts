import emailjs from "@emailjs/browser";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactMessage = (data: ContactPayload) =>
  emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      name: data.name,
      email: data.email,
      title: data.subject,
      message: data.message,
      time: new Date().toLocaleString("en-GB"),
    },
    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
  );
  export const sendSubscribe = (email: string) =>
  emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      name: "Newsletter",
      email,
      title: "New newsletter subscriber",
      message: `${email} subscribed to the newsletter.`,
      time: new Date().toLocaleString("en-GB"),
    },
    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
  );