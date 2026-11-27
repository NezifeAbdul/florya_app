
import { blogCategoriesApi } from "../../services/api/adminResources";
import TitleResourcePage from "./TitleResourcePage";

const BlogCategoriesPage = () => (
  <TitleResourcePage
    title="Blog categories"
    subtitle="Blog post categories"
    queryKey="blog-categories"
    api={blogCategoriesApi}
  />
);

export default BlogCategoriesPage;