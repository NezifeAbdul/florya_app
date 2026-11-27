import { IoSnowOutline, IoSunnyOutline } from "react-icons/io5";
import { ADMIN_ITEM, NAV_CONFIG } from "../data/navigation";
import type { MenuItem } from "../data/navigation";
import { useCollections } from "./useCollection";
import { useLocalized } from "./useLocalized";
import { useToken } from "./authStore";
import { isAdmin } from "./auth";

export const useNavItems = (): MenuItem[] => {
  const pick = useLocalized();
  const { data: collections = [] } = useCollections();
  const admin = !!useToken() && isAdmin();

  const items = admin ? [...NAV_CONFIG, ADMIN_ITEM] : NAV_CONFIG;

  return items.map((item) =>
    item.key === "collection" && collections.length > 0
      ? {
          ...item,
          submenu: collections.map((c) => ({
            key: `col-${c.id}`,
            to: `/product?collectionId=${c.id}`,
            icon: /winter|qış/i.test(`${c.titleEn} ${c.titleAz}`) ? <IoSnowOutline /> : <IoSunnyOutline />,
            label: pick(c.titleAz, c.titleEn),
          })),
        }
      : item
  );
};