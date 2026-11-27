import { useMemo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import leaf from "../../assets/images/leaf.webp";
import SectionTitle from "../../components/ui/SectionTitle";
import BlogCard from "../../components/blog/BlogCard";
import { useBlogs } from "../../utils/useBlogs";
import ReviewCarousel from "../../components/commoncomp/ReviewComponent";

const Blog = () => {
  const { data: blogs = [], isLoading, error } = useBlogs();
console.log("blogs:", blogs);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return blogs;
    const q = query.toLowerCase();
    return blogs.filter(
      (b) =>
        b.titleEn.toLowerCase().includes(q) ||
        b.contentEn?.toLowerCase().includes(q) ||
        b.categoryTitleEn?.toLowerCase().includes(q)
    );
  }, [blogs, query]);

  const [featured, ...rest] = filtered;

  if (isLoading) return <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>Yüklənir...</div>;
  if (error)     return <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>Xəta baş verdi</div>;


  return (
    <div className="blog-wrapper">
      <div className="container">
        <SectionTitle
          title="Journal"
          subtitle="Stories, styling notes and news from the Florya atelier."
          img={leaf}
        />

        <div className="blog-search">
          <IoSearchOutline size={16} />
          <input
            type="text"
            placeholder="Search articles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="blog-empty">
            <p>No articles match your search.</p>
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