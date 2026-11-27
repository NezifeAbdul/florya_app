import { useState } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import type { Blog } from "../../types/blog.types";
import { useLocalized } from "../../hooks/useLocalized";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

const CHAR_LIMIT = 120;

const BlogCard = ({ blog, featured = false }: BlogCardProps) => {
  const { t, i18n } = useTranslation();
  const pick = useLocalized();
  const [isExpanded, setIsExpanded] = useState(false);

  const isAz = i18n.language.startsWith("az");
  const title = pick(blog.titleAz, blog.titleEn);
  const category = pick(blog.categoryTitleAz, blog.categoryTitleEn);
  const author = pick(blog.authorAz, blog.authorEn);

  const fullText = pick(blog.contentAz, blog.contentEn).trim() || pick(blog.excerptAz, blog.excerptEn).trim();
  const truncatedText = fullText.length > CHAR_LIMIT ? `${fullText.slice(0, CHAR_LIMIT)}...` : fullText;
  const isLongText = fullText.length > CHAR_LIMIT;

  return (
    <article className={`blog-card ${featured ? "blog-card--featured" : ""}`}>
      <NavLink to={`/blog/${blog.slug}`} className="blog-card__img-link">
        <div className="blog-card__img-wrapper">
          {blog.coverImage ? (
            <img className="blog-card__img" src={blog.coverImage} alt={title} />
          ) : (
            <div className="blog-card__img-placeholder" />
          )}
        </div>
      </NavLink>

      <div className="blog-card__body">
        {category && <span className="blog-card__category">{category}</span>}

        <h3 className="blog-card__title">
          <NavLink to={`/blog/${blog.slug}`}>{title}</NavLink>
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
            {isExpanded ? t("blog.showLess") : t("blog.readMore")}
          </button>
        )}

        <div className="blog-card__meta">
          <span>{author}</span>
          <span className="dot" />
          <span>
            {new Date(blog.publishedAt).toLocaleDateString(isAz ? "az-AZ" : "en-GB", {
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
