import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FiSend } from "react-icons/fi";
import { sendContactMessage } from "../../services/emailService";


const schema = z.object({
  firstName: z.string().min(2, "firstName"),
  lastName: z.string().min(2, "lastName"),
  email: z.string().email("email"),
  subject: z.string().min(1, "subject"),
  message: z.string().min(10, "message"),
});

type FormValues = z.infer<typeof schema>;

const SUBJECTS = ["bridal", "appointment", "order", "general"] as const;

const ContactForm = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { subject: "" } });

  const onSubmit = async (v: FormValues) => {
    try {
      await sendContactMessage({
        name: `${v.firstName} ${v.lastName}`,
        email: v.email,
        subject: t(`contact.subjects.${v.subject}`),
        message: v.message,
      });
      toast.success(t("contact.sent"));
      reset();
    } catch {
      toast.error(t("contact.failed"));
    }
  };

  const err = (key?: string) => (key ? <small className="field-error">{t(`contact.errors.${key}`)}</small> : null);

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">{t("contact.firstName")}</label>
          <input id="firstName" placeholder="Nazifa" autoComplete="given-name" {...register("firstName")} />
          {err(errors.firstName?.message)}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">{t("contact.lastName")}</label>
          <input id="lastName" placeholder="Abdullayeva" autoComplete="family-name" {...register("lastName")} />
          {err(errors.lastName?.message)}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">{t("contact.email")}</label>
        <input id="email" type="email" placeholder="nazifa@example.com" autoComplete="email" {...register("email")} />
        {err(errors.email?.message)}
      </div>

      <div className="form-group">
        <label htmlFor="subject">{t("contact.subject")}</label>
        <select id="subject" {...register("subject")}>
          <option value="" disabled>{t("contact.selectSubject")}</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{t(`contact.subjects.${s}`)}</option>
          ))}
        </select>
        {err(errors.subject?.message)}
      </div>

      <div className="form-group">
        <label htmlFor="message">{t("contact.message")}</label>
        <textarea id="message" rows={5} placeholder={t("contact.messagePlaceholder")} {...register("message")} />
        {err(errors.message?.message)}
      </div>

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        <span>{isSubmitting ? t("contact.sending") : t("contact.send")}</span>
        <FiSend />
      </button>
    </form>
  );
};

export default ContactForm;