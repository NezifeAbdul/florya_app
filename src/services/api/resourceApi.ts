import axiosInstance from "../../lib/axiosInstance";

export interface ResourceApi<T, P> {
  getAll(): Promise<T[]>;
  create(payload: P): Promise<unknown>;
  update(id: number, payload: P): Promise<unknown>;
  remove(id: number): Promise<void>;
}

export const createResourceApi = <T, P = unknown>(
  path: string,
  params?: Record<string, unknown>
): ResourceApi<T, P> => ({
  // async getAll() {
  //   const res = await axiosInstance.get(path, { params });
  //   return Array.isArray(res.data) ? res.data : res.data.items ?? [];
  // },
  async getAll() {
  const res = await axiosInstance.get(path, { params });
  const body = res.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.items)) return body.items;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.items)) return body.data.items;
  return [];
},
  async create(payload) {
    const res = await axiosInstance.post(path, payload);
    return res.data;
  },
  async update(id, payload) {
    const res = await axiosInstance.put(`${path}/${id}`, payload);
    return res.data;
  },
  async remove(id) {
    await axiosInstance.delete(`${path}/${id}`);
  },
});