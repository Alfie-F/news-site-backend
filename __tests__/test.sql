\c nc_news_test



SELECT articles.article_id, title, topic, articles.author, articles.created_at, article_img_url, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id, title, topic, articles.author, articles.created_at, article_img_url, articles.votes ORDER BY created_at DESC;

-- Hi Please ignore this file :)