
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { blogCategoriesApi, blogsApi, getBlogById, setBlogPublished } from "../../services/api/adminResources";
import CrudPage from "../../components/admin/CrudPage";
import FormField from "../../components/admin/FormField";
import FormModal from "../../components/admin/FormModal";
import ImageUpload from "../../components/admin/ImageUpload";
import Modal from "../../components/admin/Modal";
import StatusBadge from "../../components/admin/StatusBadge";
import Thumb from "../../components/admin/Thumb";
import type { AdminBlog, Column, FormProps } from "../../types/admin.types";
import { formatDate } from "../../utils/admin/format";
import { getErrorMessage } from "../../utils/admin/getErrorMessage";
import { slugify } from "../../utils/admin/slugify";
import { toFormData } from "../../utils/admin/toFormData";

interface BlogFormValues {
  titleAz: string;
  titleEn: string;
  excerptAz: string;
  excerptEn: string;
  contentAz: string;
  contentEn: string;
  authorAz: string;
  authorEn: string;
  blogCategoryId: number | string;
  isPublished: boolean;
  image: File[];
}

const columns: Column<AdminBlog>[] = [
  { key: "image", header: "", width: "70px", render: (b) => <Thumb src={b.coverImage} alt={b.titleEn} /> },
  { key: "titleEn", header: "Title" },
  { key: "categoryTitleEn", header: "Category" },
  {
    key: "isPublished",
    header: "Status",
    width: "120px",
    render: (b) => (
      <StatusBadge tone={b.isPublished ? "success" : "neutral"}>{b.isPublished ? "Published" : "Draft"}</StatusBadge>
    ),
  },
  { key: "publishedAt", header: "Date", width: "130px", render: (b) => formatDate(b.publishedAt) },
];

const BlogFormBody = ({
  item,
  detail,
  submitting,
  onSubmit,
  onClose,
}: {
  item: AdminBlog | null;
  detail: AdminBlog | null;
  submitting: boolean;
  onSubmit: (payload: FormData) => void;
  onClose: () => void;
}) => {
  const categories = useQuery({ queryKey: ["admin", "blog-categories"], queryFn: () => blogCategoriesApi.getAll() });
  const source = detail ?? item;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogFormValues>({
    defaultValues: {
      titleAz: source?.titleAz ?? "",
      titleEn: source?.titleEn ?? "",
      excerptAz: source?.excerptAz ?? "",
      excerptEn: source?.excerptEn ?? "",
      contentAz: detail?.contentAz ?? "",
      contentEn: detail?.contentEn ?? "",
      authorAz: source?.authorAz ?? "",
      authorEn: source?.authorEn ?? "",
      blogCategoryId: source?.blogCategoryId ?? "",
      isPublished: source?.isPublished ?? true,
      image: [],
    },
  });

  const submit = async ({ image, isPublished, ...rest }: BlogFormValues) => {
    onSubmit(
      toFormData({
        ...rest,
        slug: source?.slug || slugify(rest.titleEn),
        isPublished: String(isPublished),
        coverImage: image[0],
      })
    );
    if (item && item.isPublished !== isPublished) {
      try {
        await setBlogPublished(item.id, isPublished);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    }
  };

  if (categories.isLoading) {
    return (
      <Modal open title="Loading..." onClose={onClose}>
        <div className="adm-modal__body">Loading data...</div>
      </Modal>
    );
  }

  return (
    <FormModal
      title={item ? "Edit post" : "New post"}
      width={760}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit(submit)}
    >
      <div className="adm-grid-2">
        <FormField label="Title (EN)" error={errors.titleEn?.message}>
          <input {...register("titleEn", { required: "Title is required" })} />
        </FormField>
        <FormField label="Title (AZ)" error={errors.titleAz?.message}>
          <input {...register("titleAz", { required: "Title is required" })} />
        </FormField>
        <FormField label="Author (EN)">
          <input {...register("authorEn")} />
        </FormField>
        <FormField label="Author (AZ)">
          <input {...register("authorAz")} />
        </FormField>
      </div>

      <FormField label="Category" error={errors.blogCategoryId?.message}>
        <select {...register("blogCategoryId", { required: "Select a category" })}>
          <option value="">Select</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.titleEn}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Excerpt (EN)">
        <textarea rows={2} {...register("excerptEn")} />
      </FormField>
      <FormField label="Excerpt (AZ)">
        <textarea rows={2} {...register("excerptAz")} />
      </FormField>
      <FormField label="Content (EN)" error={errors.contentEn?.message}>
        <textarea rows={5} {...register("contentEn", { required: "Content is required" })} />
      </FormField>
      <FormField label="Content (AZ)" error={errors.contentAz?.message}>
        <textarea rows={5} {...register("contentAz", { required: "Content is required" })} />
      </FormField>

      <FormField label="Cover image">
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <ImageUpload
              files={field.value}
              existing={source?.coverImage ? [source.coverImage] : []}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <div className="adm-checks">
        <label>
          <input type="checkbox" {...register("isPublished")} /> Published
        </label>
      </div>
    </FormModal>
  );
};

const BlogForm = ({ item, submitting, onSubmit, onClose }: FormProps<AdminBlog, FormData>) => {
  const { data: detail, isLoading } = useQuery({
    queryKey: ["admin", "blog", item?.id],
    queryFn: () => getBlogById(item!.id),
    enabled: !!item,
  });

  if (item && isLoading) {
    return (
      <Modal open title="Loading..." onClose={onClose}>
        <div className="adm-modal__body">Loading data...</div>
      </Modal>
    );
  }

  return (
    <BlogFormBody item={item} detail={detail ?? null} submitting={submitting} onSubmit={onSubmit} onClose={onClose} />
  );
};

const BlogsPage = () => (
  <CrudPage
    title="Blog posts"
    subtitle="Blog posts"
    queryKey="blogs"
    api={blogsApi}
    columns={columns}
    searchKeys={["titleEn", "titleAz"]}
    Form={BlogForm}
    deleteMessage={(b) => `"${b.titleEn}" will be permanently deleted.`}
  />
);

export default BlogsPage;