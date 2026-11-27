import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoSearchOutline } from "react-icons/io5";
import leaf from "../../assets/images/leaf.webp";
import SectionTitle from "../../components/ui/SectionTitle";
import BlogCard from "../../components/blog/BlogCard";
import { useBlogs } from "../../hooks/useBlogs";
import ReviewCarousel from "../../components/commoncomp/ReviewComponent";

const Blog = () => {
  const { t } = useTranslation();
  const { data: blogs = [], isLoading, error } = useBlogs();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter((b) =>
      [b.titleAz, b.titleEn, b.contentAz, b.contentEn, b.categoryTitleAz, b.categoryTitleEn].some((v) =>
        v?.toLowerCase().includes(q)
      )
    );
  }, [blogs, query]);

  const [featured, ...rest] = filtered;

  if (isLoading)
    return <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>{t("blog.loading")}</div>;
  if (error)
    return <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>{t("blog.error")}</div>;

  return (
    <div className="blog-wrapper">
      <div className="container">
        <SectionTitle title={t("blog.title")} subtitle={t("blog.subtitle")} img={leaf} />

        <div className="blog-search">
          <IoSearchOutline size={16} />
          <input
            type="text"
            placeholder={t("blog.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="blog-empty">
            <p>{t("blog.empty")}</p>
          </div>
        ) : (
          <>
            {featured && <BlogCard blog={featured} featured />}

            {rest.length > 0 && (
              <div className="blog-grid">
                {rest.map((b) => (
                  <BlogCard key={b.id} blog={b} />
                ))}
              </div>
            )}
          </>
        )}
        <ReviewCarousel />
      </div>
    </div>
  );
};

export default Blog;
