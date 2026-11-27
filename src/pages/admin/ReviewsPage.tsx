import { FiStar } from "react-icons/fi";
import type { AdminReview, Column } from "../../types/admin.types";
import CrudPage from "../../components/admin/CrudPage";
import { reviewsApi } from "../../services/api/adminResources";
import { formatDate } from "../../utils/admin/format";

type Row = AdminReview & { userFullName?: string; productTitleEn?: string };

const columns: Column<Row>[] = [
  { key: "userName", header: "Customer", width: "180px", render: (r) => r.userFullName ?? r.userName },
  { key: "productTitle", header: "Product", width: "200px", render: (r) => r.productTitleEn ?? r.productTitle ?? "-" },
  {
    key: "rating",
    header: "Rating",
    width: "110px",
    render: (r) => <span className="adm-rating"><FiStar /> {r.rating}</span>,
  },
  { key: "comment", header: "Comment" },
  { key: "createdAt", header: "Date", width: "120px", render: (r) => formatDate(r.createdAt) },
];

const ReviewsPage = () => (
  <CrudPage
    title="Reviews"
    subtitle="Reviews written by customers on product pages"
    queryKey="reviews"
    api={reviewsApi as never}
    columns={columns}
    searchKeys={["userName", "comment"]}
    deleteMessage={() => "This review will be permanently deleted."}
  />
);

export default ReviewsPage;