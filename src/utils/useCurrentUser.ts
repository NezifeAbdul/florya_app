import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { useToken } from "./authStore";

export interface CurrentUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export const getInitials = (first?: string, last?: string, fallback = "U") => {
  const value = `${first?.trim()[0] ?? ""}${last?.trim()[0] ?? ""}`.toUpperCase();
  return value || fallback;
};

export const useCurrentUser = () => {
  const token = useToken();

  const query = useQuery({
    queryKey: ["me", token],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/profile");
      return (res.data?.data ?? res.data) as CurrentUser;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const user = query.data;
  return {
    user,
    initials: getInitials(user?.firstName, user?.lastName, user?.email?.[0]?.toUpperCase()),
    fullName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
  };
};