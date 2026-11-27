
import { categoriesApi } from "../../services/api/adminResources";
import TitleResourcePage from "./TitleResourcePage";

const CategoriesPage = () => (
  <TitleResourcePage
    title="Categories"
    subtitle="Product categories"
    queryKey="categories"
    api={categoriesApi}
  />
);

export default CategoriesPage;