import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BsDot } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import { getOrders, setOrderStatus } from "../../services/api/adminResources";
import DataTable from "../../components/admin/DataTable";
import Modal from "../../components/admin/Modal";
import PageHeader from "../../components/admin/PageHeader";
import StatusBadge from "../../components/admin/StatusBadge";
import type { AdminOrder, Column } from "../../types/admin.types";
import { formatDate, formatPrice } from "../../utils/admin/format";
import { getErrorMessage } from "../../utils/admin/getErrorMessage";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusTone = (status: string) => {
  switch (status) {
    case "Delivered": return "success";
    case "Cancelled": return "danger";
    case "Pending":
    case "Processing": return "warning";
    default: return "neutral";
  }
};

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: getOrders,
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => setOrderStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const columns: Column<AdminOrder>[] = [
    { key: "id", header: "Order", width: "90px", render: (o) => `#${o.id}` },
    { key: "customerName", header: "Customer" },
    { key: "totalPrice", header: "Total", width: "110px", render: (o) => formatPrice(o.totalPrice) },
    {
      key: "status",
      header: "Status",
      width: "170px",
      render: (o) => (
        <select
          className="adm-status-select"
          value={o.status}
          disabled={changeStatus.isPending}
          onChange={(e) => changeStatus.mutate({ id: o.id, status: e.target.value })}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    { key: "createdAt", header: "Date", width: "120px", render: (o) => formatDate(o.createdAt) },
    {
      key: "details",
      header: "",
      width: "100px",
      render: (o) => (
        <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setSelected(o)}>
          Details
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Orders" subtitle="Customer orders and their statuses" />

      <DataTable
        columns={columns}
        data={orders}
        loading={isLoading}
        searchKeys={["customerName", "email", "status"]}
      />

      <Modal open={!!selected} title={selected ? `Order #${selected.id}` : ""} width={620} onClose={() => setSelected(null)}>
        {selected && (
          <div className="adm-modal__body">
            <div className="adm-order-meta">
              <p><strong>{selected.customerName}</strong></p>
              <p>
                {selected.email}
                {selected.phone && (
                  <>
                    <BsDot className="adm-inline-ico" />
                    {selected.phone}
                  </>
                )}
              </p>
              <p>
                {selected.address}, {selected.city}
                {selected.postalCode ? ` ${selected.postalCode}` : ""}, {selected.country}
              </p>
              <p>
                <StatusBadge tone={statusTone(selected.status)}>{selected.status}</StatusBadge>{" "}
                <span className="adm-muted">{formatDate(selected.createdAt)}</span>
              </p>
            </div>

            <ul className="adm-list">
              {selected.items.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.productTitle} <FiX className="adm-inline-ico" /> {item.quantity}
                    {item.selectedSize && (
                      <>
                        <BsDot className="adm-inline-ico" />
                        {item.selectedSize}
                      </>
                    )}
                    {item.selectedColor && (
                      <>
                        <BsDot className="adm-inline-ico" />
                        {item.selectedColor}
                      </>
                    )}
                  </span>
                  <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
                </li>
              ))}
              <li>
                <span>Total</span>
                <strong>{formatPrice(selected.totalPrice)}</strong>
              </li>
            </ul>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrdersPage;