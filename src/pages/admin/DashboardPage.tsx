import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiAlertCircle, FiBox, FiLayers, FiMessageSquare } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import axiosInstance from "../../lib/axiosInstance";
import PageHeader from "../../components/admin/PageHeader";
import StatCard from "../../components/admin/StatCard";
import StatusBadge from "../../components/admin/StatusBadge";
import Thumb from "../../components/admin/Thumb";
import { useCollections } from "../../utils/useCollection";
import { useLatestReviews } from "../../utils/useReviews";
import { useProductsOverview } from "../../utils/useAdmin";
import { getAdminSession } from "../../utils/adminAuth";

const PALETTE = ["#c9a96e", "#d9809f", "#7fc8a9", "#9fb8e8", "#f2b6c6", "#e8c27a"];

interface RawItem {
  productId?: number;
  quantity?: number;
  productTitleEn?: string;
  productTitle?: string;
  titleEn?: string;
}
interface RawOrder {
  items?: RawItem[];
  orderItems?: RawItem[];
}

const useOrders = () =>
  useQuery({
    queryKey: ["admin", "orders-for-dashboard"],
    retry: false,
    queryFn: async (): Promise<RawOrder[]> => {
      const res = await axiosInstance.get("/orders");
      const body = res.data;
      if (Array.isArray(body)) return body;
      return body?.items ?? body?.data ?? [];
    },
  });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const axisTick = { fontSize: 12, fill: "#8f8286" };
const tooltipStyle = { border: "none", borderRadius: 12, fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" };

const DashboardPage = () => {
  const session = getAdminSession();
  const { data: overview, isLoading } = useProductsOverview();
  const { data: collections = [] } = useCollections();
  const { data: reviews = [] } = useLatestReviews(4);
  const { data: orders = [] } = useOrders();

  const items = useMemo(() => overview?.items ?? [], [overview]);

  const stats = useMemo(() => {
    const reviewCount = items.reduce((s, p) => s + p.reviewCount, 0);
    const ratingSum = items.reduce((s, p) => s + p.averageRating * p.reviewCount, 0);
    return {
      active: items.filter((p) => p.isActive).length,
      reviewCount,
      avgRating: reviewCount ? ratingSum / reviewCount : 0,
      out: items.filter((p) => p.stock <= 0).length,
      low: items.filter((p) => p.stock > 0 && p.stock <= 2).length,
      ok: items.filter((p) => p.stock > 2).length,
    };
  }, [items]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((p) => map.set(p.categoryTitleEn, (map.get(p.categoryTitleEn) ?? 0) + 1));
    return Array.from(map, ([name, total]) => ({ name, total }));
  }, [items]);

  const stockData = [
    { name: "In stock", value: stats.ok, color: "#7fc8a9" },
    { name: "Running low", value: stats.low, color: "#e8c27a" },
    { name: "Out of stock", value: stats.out, color: "#d9809f" },
  ];

  const topOrdered = useMemo(() => {
    const byId = new Map(items.map((p) => [p.id, p]));
    const totals = new Map<number, { qty: number; fallback: string }>();

    orders.forEach((o) => {
      (o.items ?? o.orderItems ?? []).forEach((it) => {
        if (it.productId == null) return;
        const prev = totals.get(it.productId);
        totals.set(it.productId, {
          qty: (prev?.qty ?? 0) + (it.quantity ?? 1),
          fallback: it.productTitleEn ?? it.productTitle ?? it.titleEn ?? `#${it.productId}`,
        });
      });
    });

    return Array.from(totals, ([id, v]) => ({
      id,
      qty: v.qty,
      title: byId.get(id)?.titleEn ?? v.fallback,
      category: byId.get(id)?.categoryTitleEn ?? "",
      image: byId.get(id)?.primaryImage ?? "",
    }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 6);
  }, [orders, items]);

  const maxQty = topOrdered[0]?.qty ?? 1;

  const lowStockItems = useMemo(
    () => items.filter((p) => p.stock <= 2).sort((a, b) => a.stock - b.stock).slice(0, 8),
    [items]
  );

  const assigned = collections.reduce((s, c) => s + c.productCount, 0);
  const firstName = (session?.name ?? "Admin").split(" ")[0];
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <PageHeader title={`Welcome back, ${firstName}`} subtitle={today} />

      <div className="adm-stats">
        <StatCard label="Products" value={isLoading ? "-" : overview?.total ?? 0} icon={<FiBox />} />
        <StatCard label="Collections" value={collections.length} icon={<FiLayers />} />
        <StatCard label="Reviews" value={stats.reviewCount} icon={<FiMessageSquare />} />
        <StatCard label="Out of stock" value={stats.out} icon={<FiAlertCircle />} />
      </div>

      <div className="adm-dash-grid">
        <section className="adm-card">
          <div className="adm-card-head">
            <h3>Products by category</h3>
            <span>{assigned} in collections</span>
          </div>
          {byCategory.length === 0 ? (
            <p className="adm-empty">No products yet.</p>
          ) : (
            <div className="adm-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(42,34,36,0.07)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={axisTick} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} />
                  <Tooltip cursor={{ fill: "rgba(201,169,110,0.1)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="total" name="Products" barSize={48} radius={[12, 12, 0, 0]}>
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h3>Stock overview</h3>
          </div>
          <div className="adm-donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockData}
                  dataKey="value"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={4}
                  cornerRadius={8}
                  stroke="none"
                >
                  {stockData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="adm-donut__center">
              <strong>{items.length}</strong>
              <small>products</small>
            </div>
          </div>
          <div className="adm-legend">
            {stockData.map((d) => (
              <span key={d.name}>
                <i style={{ background: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className="adm-card">
        <div className="adm-card-head">
          <h3>Most ordered products</h3>
          <span>{topOrdered.length} items</span>
        </div>
        {topOrdered.length === 0 ? (
          <p className="adm-empty">No orders yet.</p>
        ) : (
          <ul className="adm-list">
            {topOrdered.map((p, i) => (
              <li key={p.id}>
                <span className="adm-rank" style={{ background: PALETTE[i % PALETTE.length] }}>
                  {i + 1}
                </span>
                <Thumb src={p.image} alt={p.title} />
                <div className="adm-list__main">
                  <strong>{p.title}</strong>
                  {p.category && <small>{p.category}</small>}
                  <div className="adm-progress">
                    <span style={{ width: `${(p.qty / maxQty) * 100}%`, background: PALETTE[i % PALETTE.length] }} />
                  </div>
                </div>
                <span className="adm-qty">{p.qty} sold</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="adm-card">
        <div className="adm-card-head">
          <h3>Low stock</h3>
          <span>{lowStockItems.length} items</span>
        </div>
        {lowStockItems.length === 0 ? (
          <p className="adm-empty">Everything is well stocked.</p>
        ) : (
          <ul className="adm-list">
            {lowStockItems.map((p) => (
              <li key={p.id}>
                <Thumb src={p.primaryImage} alt={p.titleEn} />
                <div className="adm-list__main">
                  <strong>{p.titleEn}</strong>
                  <small>{p.categoryTitleEn}</small>
                </div>
                <StatusBadge tone={p.stock <= 0 ? "danger" : "warning"}>
                  {p.stock <= 0 ? "Out of stock" : `${p.stock} left`}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="adm-card">
        <div className="adm-card-head">
          <h3>Latest reviews</h3>
          {stats.reviewCount > 0 && <span>{stats.avgRating.toFixed(1)} average rating</span>}
        </div>
        {reviews.length === 0 ? (
          <p className="adm-empty">No reviews yet.</p>
        ) : (
          <ul className="adm-reviews">
            {reviews.map((r) => (
              <li key={r.id}>
                <div className="adm-review__top">
                  <strong>{r.userFullName}</strong>
                  <span>{formatDate(r.createdAt)}</span>
                </div>
                <div className="adm-review__stars">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < r.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                  )}
                </div>
                <p>{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default DashboardPage;