export const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("en-GB") : "—";

export const formatPrice = (value?: number | null) => `$${(value ?? 0).toFixed(2)}`;