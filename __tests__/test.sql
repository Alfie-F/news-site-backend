\c nc_news_test

INSERT INTO comments (author, body, article_id, votes, created_at) VALUES ('icellusedkars', 'sam approves this message', 6, 0, NOW()) RETURNING *;

SELECT * FROM comments