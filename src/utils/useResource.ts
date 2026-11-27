import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ResourceApi } from "../services/api/resourceApi";
import { getErrorMessage } from "./admin/getErrorMessage";

export const useResource = <T, P>(key: string, api: ResourceApi<T, P>) => {
  const queryClient = useQueryClient();
  const queryKey = ["admin", key];

  const list = useQuery({ queryKey, queryFn: () => api.getAll() });

  const refresh = () => {
    // admin siyahıları, detal sorğuları və client tərəf (məhsul, kolleksiya, blog, FAQ) təzələnsin
    ["admin", "products", "product", "collections", "blogs", "blog", "faqs", "faq-categories", "reviews"].forEach((k) =>
      queryClient.invalidateQueries({ queryKey: [k] })
    );
  };

  const onDone = (message: string) => () => {
    toast.success(message);
    refresh();
  };
  const onError = (error: unknown) => toast.error(getErrorMessage(error));

  const create = useMutation({
    mutationFn: (payload: P) => api.create(payload),
    onSuccess: onDone("Added successfully"),
    onError,
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: P }) => api.update(id, payload),
    onSuccess: onDone("Changes saved"),
    onError,
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.remove(id),
    onSuccess: onDone("Deleted successfully"),
    onError,
  });

  return { list, create, update, remove };
};