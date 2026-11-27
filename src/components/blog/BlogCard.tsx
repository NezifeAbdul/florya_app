import { useState } from "react";
import { NavLink } from "react-router";
import type { Blog } from "../../types/blog.types";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

const CHAR_LIMIT = 120;

const BlogCard = ({ blog, featured = false }: BlogCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = blog.contentEn?.trim() || blog.excerptEn?.trim() || "";
  const truncatedText = fullText.length > CHAR_LIMIT
    ? `${fullText.slice(0, CHAR_LIMIT)}...`
    : fullText;
  const isLongText = fullText.length > CHAR_LIMIT;

  return (
    <article className={`blog-card ${featured ? "blog-card--featured" : ""}`}>
      <NavLink to={`/blog/${blog.slug}`} className="blog-card__img-link">
        <div className="blog-card__img-wrapper">
          {blog.coverImage ? (
            <img
              className="blog-card__img"
              src={blog.coverImage}
              alt={blog.titleEn}
            />
          ) : (
            <div className="blog-card__img-placeholder" />
          )}
        </div>
      </NavLink>

      <div className="blog-card__body">
        {blog.categoryTitleEn && (
          <span className="blog-card__category">{blog.categoryTitleEn}</span>
        )}

        <h3 className="blog-card__title">
          <NavLink to={`/blog/${blog.slug}`}>{blog.titleEn}</NavLink>
        </h3>

        {fullText && (
          <p className={`blog-card__excerpt ${isExpanded ? "is-expanded" : ""}`}>
            {isExpanded ? fullText : truncatedText}
          </p>
        )}

        {isLongText && (
          <button
            type="button"
            className="blog-card__readmore-btn"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}

        <div className="blog-card__meta">
          <span>{blog.authorEn}</span>
          <span className="dot" />
          <span>
            {new Date(blog.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;