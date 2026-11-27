
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import type { Product, ProductDetail, ProductImage } from "../../types/product.types";
import { getProductById } from "../../services/api/productService";
import { categoriesApi, collectionsApi, productImagesApi, productsApi } from "../../services/api/adminResources";
import CrudPage from "../../components/admin/CrudPage";
import FormField from "../../components/admin/FormField";
import FormModal from "../../components/admin/FormModal";
import ImageUpload from "../../components/admin/ImageUpload";
import Modal from "../../components/admin/Modal";
import StatusBadge from "../../components/admin/StatusBadge";
import TagInput from "../../components/admin/TagInput";
import Thumb from "../../components/admin/Thumb";
import type { Column, FormProps } from "../../types/admin.types";
import { formatPrice } from "../../utils/admin/format";
import { getErrorMessage } from "../../utils/admin/getErrorMessage";
import { imageUrl } from "../../utils/admin/imageUrl";
import { slugify } from "../../utils/admin/slugify";
import { toFormData } from "../../utils/admin/toFormData";

interface ProductFormValues {
  titleAz: string;
  titleEn: string;
  price: number;
  discountPrice: number | string;
  stock: number;
  categoryId: number | string;
  collectionId: number | string;
  sizes: string[];
  colors: string[];
  isActive: boolean;
  isFeatured: boolean;
  images: File[];
}

const columns: Column<Product>[] = [
  { key: "image", header: "", width: "70px", render: (p) => <Thumb src={p.primaryImage} alt={p.titleEn} /> },
  { key: "titleEn", header: "Product" },
  { key: "categoryTitleEn", header: "Category" },
  {
    key: "price",
    header: "Price",
    render: (p) =>
      p.discountPrice != null && p.discountPrice < p.price ? (
        <>
          <strong>{formatPrice(p.discountPrice)}</strong> <s className="adm-muted">{formatPrice(p.price)}</s>
        </>
      ) : (
        formatPrice(p.price)
      ),
  },
  {
    key: "stock",
    header: "Stock",
    render: (p) => (
      <StatusBadge tone={p.stock <= 0 ? "danger" : p.stock <= 3 ? "warning" : "success"}>{p.stock}</StatusBadge>
    ),
  },
  {
    key: "isActive",
    header: "Status",
    render: (p) => (
      <StatusBadge tone={p.isActive ? "success" : "neutral"}>{p.isActive ? "Active" : "Hidden"}</StatusBadge>
    ),
  },
];

const ExistingImages = ({ productId, images }: { productId: number; images: ProductImage[] }) => {
  const queryClient = useQueryClient();

  const action = useMutation({
    mutationFn: (request: () => Promise<unknown>) => request(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "product", productId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (images.length === 0) return null;

  return (
    <div className="adm-img-manager">
      {images.map((img) => (
        <div className="adm-img-manager__item" key={img.id}>
          <img src={imageUrl(img.url)} alt="" />
          <div className="adm-img-manager__badges">
            {img.isPrimary && <span>Main</span>}
            {img.isHover && <span>Hover</span>}
          </div>
          <div className="adm-img-manager__actions">
            <button
              type="button"
              disabled={img.isPrimary || action.isPending}
              onClick={() => action.mutate(() => productImagesApi.setPrimary(productId, img.id))}
            >
              Main
            </button>
            <button
              type="button"
              disabled={img.isHover || action.isPending}
              onClick={() => action.mutate(() => productImagesApi.setHover(productId, img.id))}
            >
              Hover
            </button>
            <button
              type="button"
              className="danger"
              disabled={action.isPending}
              onClick={() => action.mutate(() => productImagesApi.remove(productId, img.id))}
              aria-label="Delete image"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductFormBody = ({
  detail,
  submitting,
  onSubmit,
  onClose,
}: {
  detail: ProductDetail | null;
  submitting: boolean;
  onSubmit: (payload: FormData) => void;
  onClose: () => void;
}) => {
  const categories = useQuery({ queryKey: ["admin", "categories"], queryFn: () => categoriesApi.getAll() });
  const collections = useQuery({ queryKey: ["admin", "collections"], queryFn: () => collectionsApi.getAll() });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      titleAz: detail?.titleAz ?? "",
      titleEn: detail?.titleEn ?? "",
      price: detail?.price ?? 0,
      discountPrice: detail?.discountPrice ?? "",
      stock: detail?.stock ?? 0,
      categoryId: detail?.categoryId ?? "",
      collectionId: detail?.collectionId ?? "",
      sizes: detail?.sizes ?? [],
      colors: detail?.colors ?? [],
      isActive: detail?.isActive ?? true,
      isFeatured: detail?.isFeatured ?? false,
      images: [],
    },
  });

  const submit = ({ images, ...rest }: ProductFormValues) => {
    onSubmit(toFormData({ ...rest, slug: detail?.slug || slugify(rest.titleEn), images }));
  };

  if (categories.isLoading || collections.isLoading) {
    return (
      <Modal open title="Loading..." onClose={onClose}>
        <div className="adm-modal__body">Loading data...</div>
      </Modal>
    );
  }

  return (
    <FormModal
      title={detail ? "Edit product" : "New product"}
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

        <FormField label="Price ($)" error={errors.price?.message}>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0.01, message: "Price must be greater than 0" },
            })}
          />
        </FormField>
        <FormField label="Discount price ($)" error={errors.discountPrice?.message} hint="Leave empty for no discount">
          <input
            type="number"
            step="0.01"
            {...register("discountPrice", {
              validate: (value) => {
                if (value === "" || value === null || Number.isNaN(Number(value))) return true;
                return Number(value) < Number(getValues("price")) || "Discount price must be lower than the price";
              },
            })}
          />
        </FormField>

        <FormField label="Category" error={errors.categoryId?.message}>
          <select {...register("categoryId", { required: "Select a category" })}>
            <option value="">Select</option>
            {categories.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titleEn}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Collection">
          <select {...register("collectionId")}>
            <option value="">None</option>
            {collections.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titleEn}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Stock" error={errors.stock?.message}>
          <input
            type="number"
            {...register("stock", {
              required: "Stock is required",
              valueAsNumber: true,
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
        </FormField>
        <div className="adm-checks">
          <label>
            <input type="checkbox" {...register("isActive")} /> Active
          </label>
          <label>
            <input type="checkbox" {...register("isFeatured")} /> Featured
          </label>
        </div>
      </div>

      <FormField label="Sizes" hint="Type and press Enter">
        <Controller
          name="sizes"
          control={control}
          render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="S, M, L..." />}
        />
      </FormField>

      <FormField label="Colors" hint="CSS color name (red, white, beige...)">
        <Controller
          name="colors"
          control={control}
          render={({ field }) => (
            <TagInput value={field.value} onChange={field.onChange} placeholder="white, beige..." />
          )}
        />
      </FormField>

      {detail && (
        <FormField label="Current images">
          <ExistingImages productId={detail.id} images={detail.images} />
        </FormField>
      )}

      <FormField label={detail ? "Add new images" : "Images"} hint={detail ? undefined : "The first image will be the main image"}>
        <Controller
          name="images"
          control={control}
          render={({ field }) => <ImageUpload multiple files={field.value} onChange={field.onChange} />}
        />
      </FormField>
    </FormModal>
  );
};

const ProductForm = ({ item, submitting, onSubmit, onClose }: FormProps<Product, FormData>) => {
  const { data: detail, isLoading } = useQuery({
    queryKey: ["admin", "product", item?.id],
    queryFn: () => getProductById(item!.id),
    enabled: !!item,
  });

  if (item && isLoading) {
    return (
      <Modal open title="Loading..." onClose={onClose}>
        <div className="adm-modal__body">Loading data...</div>
      </Modal>
    );
  }

  return <ProductFormBody detail={detail ?? null} submitting={submitting} onSubmit={onSubmit} onClose={onClose} />;
};

const ProductsPage = () => (
  <CrudPage
    title="Products"
    subtitle="Add products and manage prices and stock"
    queryKey="products"
    api={productsApi}
    columns={columns}
    searchKeys={["titleEn", "titleAz", "categoryTitleEn"]}
    Form={ProductForm}
    deleteMessage={(p) => `"${p.titleEn}" will be permanently deleted.`}
  />
);

export default ProductsPage;