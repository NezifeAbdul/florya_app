export const toFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item instanceof Blob ? item : String(item)));
      return;
    }
    formData.append(key, value instanceof Blob ? value : String(value));
  });

  return formData;
};
