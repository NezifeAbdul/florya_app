import { faqCategoriesApi } from "../../services/api/adminResources";
import TitleResourcePage from "./TitleResourcePage";

const FaqCategoriesPage = () => (
  <TitleResourcePage
    title="FAQ categories"
    subtitle="Groups for frequently asked questions"
    queryKey="faq-categories"
    api={faqCategoriesApi}
  />
);

export default FaqCategoriesPage;