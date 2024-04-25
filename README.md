# Northcoders News API

This project is an api built for a hypothetical news-site NC-News. it provides a series of endpoints covering CRUD functions involving articles, topics and comments.

The hosted version of this api can be found at https://alfs-nc-news.onrender.com/api - this will provide you with a list of endpoints, with descriptions and example responses.

Should you wish to clone this repository, please access this at https://github.com/Alfie-F/news-site-backend. You would need to fork this and clone to your own system.

If you wish to run this file locally you will need to create two .env files. These will be env.test and env.development. They will contain "PGDATABASE=nc_news_test" and "PGDATABASE=nc_news" respectively. Please also run "npm install" for the dependencies.

You may then run tests using "npm run test". You may want to remove "--runInBand" from the run test script within the package.json if you want to see estimates for the completion time of your tests. To run work with the development data, please first seed the local database by running "npm run seed".

It is recommended to use node version 21.6.1 and PostgresSQL 14.11 for this.
