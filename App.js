import React, { useState, useEffect, useCallback } from "react";
// import oneData from "./oneData.json"; // I had taken this temporarily to check the data because of CORS issue
import "./App.css";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Function to check if the user has scrolled to the bottom of the page
  const isScrollBottom = () => {
    return (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 1
    );
  };

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://englishapi.pinkvilla.com/app-api/v1/photo-gallery-feed-page/page/${page}`
      );
      const newArticles = await response.json();
      // const newArticles = oneData;
      setArticles((prev) => [
        ...prev,
        ...newArticles.nodes.map((node) => node.node),
      ]);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
    setLoading(false);
  }, [page]);

  // Initial data fetch
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollBottom() && !loading) {
        setPage((prevPage) => prevPage + 1); // Increment page to fetch next set of articles
      }
    };

    // Register scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="articles-container">
      {articles.map((article, index) => (
        <div key={index} className="article-card">
          <img
            src={article.field_photo_image_section}
            alt={article.title}
            className="article-image"
          />
          <div className="article-content">
            <h2 className="article-title">{article.title}</h2>
            <p className="article-date">
              Last updated:{" "}
              {new Date(article.last_update * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
