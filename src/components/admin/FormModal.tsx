import type { FormEventHandler, ReactNode } from "react";
import Modal from "./Modal";

interface FormModalProps {
  title: string;
  width?: number;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

const FormModal = ({ title, width, submitting, onClose, onSubmit, children }: FormModalProps) => (
  <Modal open title={title} width={width} onClose={onClose}>
    <form onSubmit={onSubmit} noValidate>
      <div className="adm-modal__body">{children}</div>
      <div className="adm-modal__foot">
        <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>
          Ləğv et
        </button>
        <button type="submit" className="adm-btn adm-btn--primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  </Modal>
);

export default FormModal;