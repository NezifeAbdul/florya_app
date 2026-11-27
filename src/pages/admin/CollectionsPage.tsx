
import { Controller, useForm } from "react-hook-form";
import { collectionsApi } from "../../services/api/adminResources";
import CrudPage from "../../components/admin/CrudPage";
import FormField from "../../components/admin/FormField";
import FormModal from "../../components/admin/FormModal";
import ImageUpload from "../../components/admin/ImageUpload";
import Thumb from "../../components/admin/Thumb";
import type { AdminCollection, Column, FormProps } from "../../types/admin.types";
import { toFormData } from "../../utils/admin/toFormData";
import { slugify } from "../../utils/admin/slugify";

interface CollectionFormValues {
  titleAz: string;
  titleEn: string;
  image: File[];
}

const columns: Column<AdminCollection>[] = [
  { key: "image", header: "", width: "70px", render: (c) => <Thumb src={c.image} alt={c.titleEn} /> },
  { key: "titleEn", header: "Title (EN)" },
  { key: "titleAz", header: "Title (AZ)" },
  { key: "productCount", header: "Products", width: "100px" },
];

const CollectionForm = ({ item, submitting, onSubmit, onClose }: FormProps<AdminCollection, FormData>) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    defaultValues: { titleAz: item?.titleAz ?? "", titleEn: item?.titleEn ?? "", image: [] },
  });

  const submit = ({ image, ...rest }: CollectionFormValues) =>
    onSubmit(toFormData({ ...rest, slug: item?.slug || slugify(rest.titleEn), image: image[0] }));

  return (
    <FormModal
      title={item ? "Edit collection" : "New collection"}
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
      <FormField label="Image" hint={item ? "The current image is kept unless you choose a new one" : undefined}>
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <ImageUpload files={field.value} existing={item?.image ? [item.image] : []} onChange={field.onChange} />
          )}
        />
      </FormField>
    </FormModal>
  );
};

const CollectionsPage = () => (
  <CrudPage
    title="Collections"
    subtitle="Seasonal and themed collections"
    queryKey="collections"
    api={collectionsApi}
    columns={columns}
    searchKeys={["titleEn", "titleAz"]}
    Form={CollectionForm}
    deleteMessage={(c) => `"${c.titleEn}" will be permanently deleted.`}
  />
);

export default CollectionsPage;