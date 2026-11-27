import { imageUrl } from "../../utils/admin/imageUrl";

const Thumb = ({ src, alt = "" }: { src?: string | null; alt?: string }) =>
  src ? (
    <img className="adm-thumb" src={imageUrl(src)} alt={alt} />
  ) : (
    <div className="adm-thumb adm-thumb--empty" />
  );

export default Thumb;