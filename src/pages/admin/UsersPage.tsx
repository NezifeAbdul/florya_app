import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiPlus, FiSearch } from "react-icons/fi";
import { createUser, getUsers, setUserStatus } from "../../services/api/adminResources";
import PageHeader from "../../components/admin/PageHeader";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import FormField from "../../components/admin/FormField";
import FormModal from "../../components/admin/FormModal";
import type { AdminUser, UserPayload } from "../../types/admin.types";
import { formatDate } from "../../utils/admin/format";
import { getErrorMessage } from "../../utils/admin/getErrorMessage";

const UserForm = ({
  submitting,
  onSubmit,
  onClose,
}: {
  submitting: boolean;
  onSubmit: (payload: UserPayload) => void;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserPayload>({
    defaultValues: { firstName: "", lastName: "", email: "", password: "", role: "User" },
  });

  return (
    <FormModal title="Yeni istifadəçi" submitting={submitting} onClose={onClose} onSubmit={handleSubmit(onSubmit)}>
      <div className="adm-grid-2">
        <FormField label="First name" error={errors.firstName?.message}>
          <input {...register("firstName", { required: "Ad tələb olunur" })} />
        </FormField>
        <FormField label="Last name" error={errors.lastName?.message}>
          <input {...register("lastName", { required: "Soyad tələb olunur" })} />
        </FormField>
      </div>

      <FormField label="Email" error={errors.email?.message}>
        <input
          type="email"
          {...register("email", {
            required: "Email tələb olunur",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Email düzgün deyil" },
          })}
        />
      </FormField>

      <FormField label="Password" error={errors.password?.message} hint="Ən azı 6 simvol">
        <input
          type="password"
          autoComplete="new-password"
          {...register("password", {
            required: "Parol tələb olunur",
            minLength: { value: 6, message: "Ən azı 6 simvol" },
          })}
        />
      </FormField>

      <FormField label="Role">
        <select {...register("role")}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </FormField>
    </FormModal>
  );
};

const UsersPage = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getUsers,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

  const toggleStatus = useMutation({
    mutationFn: (user: AdminUser) => setUserStatus(user.id, !user.isActive),
    onSuccess: () => {
      toast.success("Status updated");
      refresh();
      setTarget(null);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const create = useMutation({
    mutationFn: (payload: UserPayload) => createUser(payload),
    onSuccess: () => {
      toast.success("User added");
      refresh();
      setFormOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      `${u.firstName ?? ""} ${u.lastName ?? ""} ${u.email}`.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <>
      <PageHeader title="Users" subtitle="Qeydiyyatdan keçmiş istifadəçilər">
        <button type="button" className="adm-btn adm-btn--primary" onClick={() => setFormOpen(true)}>
          <FiPlus /> Əlavə et
        </button>
      </PageHeader>

      <div className="adm-card adm-table-card">
        <div className="adm-table-toolbar">
          <div className="adm-search">
            <FiSearch />
            <input value={query} placeholder="Search..." onChange={(e) => setQuery(e.target.value)} />
          </div>
          <span className="adm-table-count">{rows.length} nəticə</span>
        </div>

        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="adm-table-empty">Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="adm-table-empty">No data found</td></tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id}>
                    <td>{`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—"}</td>
                    <td>{u.email}</td>
                    <td><StatusBadge>{String(u.role ?? "User")}</StatusBadge></td>
                    <td>
                      <StatusBadge tone={u.isActive ? "success" : "danger"}>
                        {u.isActive ? "Active" : "Blocked"}
                      </StatusBadge>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setTarget(u)}>
                        {u.isActive ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <UserForm
          submitting={create.isPending}
          onSubmit={(payload) => create.mutate(payload)}
          onClose={() => setFormOpen(false)}
        />
      )}

      <ConfirmDialog
        open={!!target}
        title={target?.isActive ? "İstifadəçini blokla" : "Blokdan çıxar"}
        message={
          target
            ? `${target.email} istifadəçisi ${target.isActive ? "bloklanacaq" : "yenidən aktiv olacaq"}.`
            : ""
        }
        confirmLabel="Təsdiqlə"
        loading={toggleStatus.isPending}
        onConfirm={() => target && toggleStatus.mutate(target)}
        onCancel={() => setTarget(null)}
      />
    </>
  );
};

export default UsersPage;