import { useState } from "react";
import type { ComponentType } from "react";
import { FiPlus } from "react-icons/fi";
import { useResource } from "../../hooks/useResource";
import type { Column, Entity, FormProps } from "../../types/admin.types";
import ConfirmDialog from "./ConfirmDialog";
import DataTable from "./DataTable";
import PageHeader from "./PageHeader";

import type { ResourceApi } from "../../services/api/resourceApi";
import { toast } from "react-toastify";
interface CrudPageProps<T extends Entity, P> {
  title: string;
  subtitle?: string;
  queryKey: string;
  editable?: boolean;
  api: ResourceApi<T, P>;
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  Form?: ComponentType<FormProps<T, P>>;
  deletable?: boolean;
  deleteMessage?: (row: T) => string;
}

const CrudPage = <T extends Entity, P>({
  title,
  subtitle,
  queryKey,
  api,
  columns,
  searchKeys,
  Form,
  deletable = true,
  editable = true,
  
  deleteMessage,
}: CrudPageProps<T, P>) => {
  const { list, create, update, remove } = useResource<T, P>(queryKey, api);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  const openForm = (item: T | null) => {
    setEditing(item);
    setFormOpen(true);
  };

    const closeForm = (cancelled = false) => {
    if (cancelled) toast.info("Changes discarded");
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (payload: P) => {
    if (editing) {
      update.mutate({ id: editing.id, payload }, { onSuccess: () => closeForm() });
    } else {
      create.mutate(payload, { onSuccess: () => closeForm() });
    }
  };

  const handleDelete = () => {
    if (!deleting) return;
    remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  };

  return (
    <>
      <PageHeader title={title} subtitle={subtitle}>
        {Form && (
          <button type="button" className="adm-btn adm-btn--primary" onClick={() => openForm(null)}>
            <FiPlus /> Add
          </button>
        )}
      </PageHeader>

      <DataTable
        columns={columns}
        data={list.data ?? []}
        loading={list.isLoading}
        searchKeys={searchKeys}
        // onEdit={Form ? (row) => openForm(row) : undefined}
        onEdit={Form && editable ? (row) => openForm(row) : undefined}
        onDelete={deletable ? (row) => setDeleting(row) : undefined}
      />

      {Form && formOpen && (
        <Form
          key={editing?.id ?? "new"}
          item={editing}
          submitting={create.isPending || update.isPending}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

           <ConfirmDialog
        open={!!deleting}
        message={deleting && deleteMessage ? deleteMessage(deleting) : "This record will be permanently deleted."}
        loading={remove.isPending}
        onConfirm={handleDelete}
        onCancel={() => { setDeleting(null); toast.info("Deletion cancelled"); }}
      />
    </>
  );
};

export default CrudPage;