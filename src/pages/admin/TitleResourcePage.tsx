import { useForm } from "react-hook-form";
import type { ResourceApi } from "../../services/api/resourceApi";
import CrudPage from "../../components/admin/CrudPage";
import FormField from "../../components/admin/FormField";
import FormModal from "../../components/admin/FormModal";
import type { Column, FormProps, TitleItem, TitlePayload } from "../../types/admin.types";
import { slugify } from "../../utils/admin/slugify";

const columns: Column<TitleItem>[] = [
  { key: "id", header: "ID", width: "80px" },
  { key: "titleEn", header: "Title (EN)" },
  { key: "titleAz", header: "Title (AZ)" },
  { key: "slug", header: "Slug" },
];

const TitleForm = ({ item, submitting, onSubmit, onClose }: FormProps<TitleItem, TitlePayload>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TitlePayload>({
    defaultValues: {
      titleAz: item?.titleAz ?? "",
      titleEn: item?.titleEn ?? "",
      slug: item?.slug ?? "",
    },
  });

  const submit = (values: TitlePayload) =>
    onSubmit({ ...values, slug: values.slug.trim() || slugify(values.titleEn) });

  return (
    <FormModal
      title={item ? "Redaktə et" : "Yeni əlavə et"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit(submit)}
    >
      <FormField label="Title (EN)" error={errors.titleEn?.message}>
        <input {...register("titleEn", { required: "Title is required" })} />
      </FormField>
      <FormField label="Title (AZ)" error={errors.titleAz?.message}>
        <input {...register("titleAz", { required: "Title is required" })} />
      </FormField>
      <FormField label="Slug" hint="Boş buraxsan başlıqdan avtomatik yaranacaq">
        <input {...register("slug")} placeholder="bridal-dresses" />
      </FormField>
    </FormModal>
  );
};

interface TitleResourcePageProps {
  title: string;
  subtitle?: string;
  queryKey: string;
  api: ResourceApi<TitleItem, TitlePayload>;
}

const TitleResourcePage = ({ title, subtitle, queryKey, api }: TitleResourcePageProps) => (
  <CrudPage
    title={title}
    subtitle={subtitle}
    queryKey={queryKey}
    api={api}
    columns={columns}
    searchKeys={["titleEn", "titleAz"]}
    Form={TitleForm}
    deleteMessage={(row) => `"${row.titleEn}" silinəcək. Bağlı qeydlər varsa silinmə uğursuz ola bilər.`}
  />
);

export default TitleResourcePage;