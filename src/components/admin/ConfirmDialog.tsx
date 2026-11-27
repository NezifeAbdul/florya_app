import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  loading?: boolean;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  
}

const ConfirmDialog = ({ open, title = "Əminsiniz?", message, loading, onConfirm, onCancel }: ConfirmDialogProps) => (
  <Modal open={open} title={title} width={420} onClose={onCancel}>
    <div className="adm-modal__body">
      <p className="adm-confirm-text">{message}</p>
    </div>
    <div className="adm-modal__foot">
      <button type="button" className="adm-btn adm-btn--ghost" onClick={onCancel}>
        Ləğv et
      </button>
      <button type="button" className="adm-btn adm-btn--danger" onClick={onConfirm} disabled={loading}>
        {loading ? "Silinir..." : "Delete"}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;