import { faqCategoriesApi } from "../../services/api/adminResources";
import TitleResourcePage from "./TitleResourcePage";

const FaqCategoriesPage = () => (
  <TitleResourcePage
    title="FAQ categories"
    subtitle="Frequently asked questionsın qrupları"
    queryKey="faq-categories"
    api={faqCategoriesApi}
  />
);

export default FaqCategoriesPage;