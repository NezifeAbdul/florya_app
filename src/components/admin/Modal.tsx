import type { ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import { FiX } from "react-icons/fi";

interface ModalProps {
  open: boolean;
  title: string;
  width?: number;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ open, title, width = 560, onClose, children }: ModalProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    sx={{ "& .MuiDialog-paper": { maxWidth: width, borderRadius: "4px" } }}
  >
    <div className="adm-modal__head">
      <h3>{title}</h3>
      <button type="button" onClick={onClose} aria-label="Close">
        <FiX />
      </button>
    </div>
    {children}
  </Dialog>
);

export default Modal;