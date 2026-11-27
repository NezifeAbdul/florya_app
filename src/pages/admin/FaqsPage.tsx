import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { useFaqCategories } from "../../utils/useFaqs";
import {
  useAdminFaqs, useDeleteFaq, useDeleteFaqCategory, useSaveFaq, useSaveFaqCategory,
} from "../../utils/useAdmin";
import { getErrorMessage } from "../../utils/admin/getErrorMessage";
import type { Faq, FaqCategory, FaqCategoryPayload, FaqPayload } from "../../types/faq.types";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import PageHeader from "../../components/admin/PageHeader";
import FormField from "../../components/admin/FormField";
import StatusBadge from "../../components/admin/StatusBadge";

type Tab = "faqs" | "categories";

const FaqModal = ({ faq, categories, onClose }: { faq: Faq | null; categories: FaqCategory[]; onClose: () => void }) => {
  const save = useSaveFaq();
  const [form, setForm] = useState<FaqPayload>({
    faqCategoryId: faq?.faqCategoryId ?? categories[0]?.id ?? 0,
    questionAz: faq?.questionAz ?? "", questionEn: faq?.questionEn ?? "",
    answerAz: faq?.answerAz ?? "", answerEn: faq?.answerEn ?? "",
    displayOrder: faq?.displayOrder ?? 0, isActive: faq?.isActive ?? true,
  });
  const set = <K extends keyof FaqPayload>(k: K, v: FaqPayload[K]) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.questionEn.trim() || !form.answerEn.trim()) return void toast.warning("Question and answer (EN) are required");
    try {
      await save.mutateAsync({ id: faq?.id, data: form });
      toast.success(faq ? "Question updated" : "Question added");
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Modal open title={faq ? "Edit question" : "New question"} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="adm-modal__body">
          {categories.length === 0 && <div className="adm-alert">Create a category first, then add questions to it.</div>}
          <FormField label="Category">
            <select value={form.faqCategoryId} onChange={(e) => set("faqCategoryId", Number(e.target.value))}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.titleEn}</option>)}
            </select>
          </FormField>
          <div className="adm-grid-2">
            <FormField label="Question (EN)"><input value={form.questionEn} onChange={(e) => set("questionEn", e.target.value)} /></FormField>
            <FormField label="Question (AZ)"><input value={form.questionAz} onChange={(e) => set("questionAz", e.target.value)} /></FormField>
          </div>
          <FormField label="Answer (EN)"><textarea rows={3} value={form.answerEn} onChange={(e) => set("answerEn", e.target.value)} /></FormField>
          <FormField label="Answer (AZ)"><textarea rows={3} value={form.answerAz} onChange={(e) => set("answerAz", e.target.value)} /></FormField>
          <div className="adm-grid-2">
            <FormField label="Display order">
              <input type="number" min={0} value={form.displayOrder} onChange={(e) => set("displayOrder", Number(e.target.value))} />
            </FormField>
            <div className="adm-checks">
              <label><input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} /> Visible on store</label>
            </div>
          </div>
        </div>
        <div className="adm-modal__foot">
          <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="adm-btn adm-btn--primary" disabled={save.isPending || categories.length === 0}>
            {save.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const CategoryModal = ({ category, onClose }: { category: FaqCategory | null; onClose: () => void }) => {
  const save = useSaveFaqCategory();
  const [form, setForm] = useState<FaqCategoryPayload>({
    titleAz: category?.titleAz ?? "", titleEn: category?.titleEn ?? "", displayOrder: category?.displayOrder ?? 0,
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.titleEn.trim()) return void toast.warning("English title is required");
    try {
      await save.mutateAsync({ id: category?.id, data: form });
      toast.success(category ? "Category updated" : "Category added");
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Modal open title={category ? "Edit category" : "New category"} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="adm-modal__body">
          <div className="adm-grid-2">
            <FormField label="Title (EN)"><input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></FormField>
            <FormField label="Title (AZ)"><input value={form.titleAz} onChange={(e) => setForm({ ...form, titleAz: e.target.value })} /></FormField>
          </div>
          <FormField label="Display order">
            <input type="number" min={0} value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
          </FormField>
        </div>
        <div className="adm-modal__foot">
          <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="adm-btn adm-btn--primary" disabled={save.isPending}>{save.isPending ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </Modal>
  );
};

const AdminFaqs = () => {
  const [tab, setTab] = useState<Tab>("faqs");
  const [search, setSearch] = useState("");
  const [faqModal, setFaqModal] = useState<{ item: Faq | null } | null>(null);
  const [categoryModal, setCategoryModal] = useState<{ item: FaqCategory | null } | null>(null);
  const [deleting, setDeleting] = useState<{ type: Tab; id: number; label: string } | null>(null);

  const { data: faqs = [], isLoading: faqsLoading } = useAdminFaqs();
  const { data: categories = [], isLoading: catLoading } = useFaqCategories();
  const removeFaq = useDeleteFaq();
  const removeCategory = useDeleteFaqCategory();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((f) =>
      f.questionEn.toLowerCase().includes(q) || f.questionAz.toLowerCase().includes(q) ||
      (f.faqCategoryTitleEn ?? "").toLowerCase().includes(q));
  }, [faqs, search]);

  const confirmDelete = () => {
    if (!deleting) return;
    const done = { onSuccess: () => { toast.success("Deleted successfully"); setDeleting(null); }, onError: (e: unknown) => toast.error(getErrorMessage(e)) };
    if (deleting.type === "faqs") removeFaq.mutate(deleting.id, done);
    else removeCategory.mutate(deleting.id, done);
  };

  return (
    <>
      <PageHeader title="FAQ" subtitle="Manage the questions shown on the storefront">
        <button type="button" className="adm-btn adm-btn--primary"
          onClick={() => (tab === "faqs" ? setFaqModal({ item: null }) : setCategoryModal({ item: null }))}>
          <FiPlus /> {tab === "faqs" ? "Add question" : "Add category"}
        </button>
      </PageHeader>

      <div className="adm-tabs">
        <button type="button" className={tab === "faqs" ? "active" : ""} onClick={() => setTab("faqs")}>Questions <b>{faqs.length}</b></button>
        <button type="button" className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>Categories <b>{categories.length}</b></button>
      </div>

      <div className="adm-card adm-table-card">
        {tab === "faqs" && (
          <div className="adm-table-toolbar">
            <label className="adm-search">
              <FiSearch />
              <input placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </label>
            <span className="adm-table-count">{filtered.length} results</span>
          </div>
        )}

        <div className="adm-table-scroll">
          {tab === "faqs" ? (
            <table className="adm-table">
              <thead><tr><th style={{ width: 60 }}>#</th><th>Question</th><th>Category</th><th style={{ width: 110 }}>Status</th><th style={{ width: 100 }} /></tr></thead>
              <tbody>
                {faqsLoading ? <tr><td colSpan={5} className="adm-table-empty">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={5} className="adm-table-empty">No questions found</td></tr>
                : filtered.map((f) => (
                  <tr key={f.id}>
                    <td>{f.displayOrder}</td>
                    <td><strong>{f.questionEn}</strong><div className="adm-muted">{f.questionAz}</div></td>
                    <td>{f.faqCategoryTitleEn}</td>
                    <td><StatusBadge tone={f.isActive ? "success" : "neutral"}>{f.isActive ? "Active" : "Hidden"}</StatusBadge></td>
                    <td>
                      <div className="adm-row-actions">
                        <button type="button" aria-label="Edit" onClick={() => setFaqModal({ item: f })}><FiEdit2 /></button>
                        <button type="button" className="danger" aria-label="Delete" onClick={() => setDeleting({ type: "faqs", id: f.id, label: f.questionEn })}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="adm-table">
              <thead><tr><th style={{ width: 60 }}>#</th><th>Title</th><th style={{ width: 120 }}>Questions</th><th style={{ width: 100 }} /></tr></thead>
              <tbody>
                {catLoading ? <tr><td colSpan={4} className="adm-table-empty">Loading...</td></tr>
                : categories.length === 0 ? <tr><td colSpan={4} className="adm-table-empty">No categories yet</td></tr>
                : categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.displayOrder}</td>
                    <td><strong>{c.titleEn}</strong><div className="adm-muted">{c.titleAz}</div></td>
                    <td>{c.faqCount ?? 0}</td>
                    <td>
                      <div className="adm-row-actions">
                        <button type="button" aria-label="Edit" onClick={() => setCategoryModal({ item: c })}><FiEdit2 /></button>
                        <button type="button" className="danger" aria-label="Delete" onClick={() => setDeleting({ type: "categories", id: c.id, label: c.titleEn })}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {faqModal && <FaqModal faq={faqModal.item} categories={categories} onClose={() => setFaqModal(null)} />}
      {categoryModal && <CategoryModal category={categoryModal.item} onClose={() => setCategoryModal(null)} />}

      <ConfirmDialog
        open={!!deleting}
        message={deleting ? `"${deleting.label}" will be permanently deleted.` : ""}
        loading={removeFaq.isPending || removeCategory.isPending}
        onConfirm={confirmDelete}
        onCancel={() => { setDeleting(null); toast.info("Deletion cancelled"); }}
      />
    </>
  );
};

export default AdminFaqs;