import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  loading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  loading,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loadingLabel = "Deleting...",
  tone = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Modal open={open} title={title} width={420} onClose={onCancel}>
    <div className="adm-modal__body">
      <p className="adm-confirm-text">{message}</p>
    </div>
    <div className="adm-modal__foot">
      <button type="button" className="adm-btn adm-btn--ghost" onClick={onCancel}>
        {cancelLabel}
      </button>
      <button type="button" className={`adm-btn adm-btn--${tone}`} onClick={onConfirm} disabled={loading}>
        {loading ? loadingLabel : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
