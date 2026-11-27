import { useQuery } from "@tanstack/react-query";
import { getCollections } from "../services/api/collectionService";

export const useCollections = () =>
  useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
  });