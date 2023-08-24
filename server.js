const axios = require("axios");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("home", {
    title: "Search Hacker News",
  });
});

async function searchHN(query) {
  const response = await axios.get(
    `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=90`
  );

  return response.data;
}

app.get('/search', async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    res.redirect(302, '/');
    return;
  }

  const results = await searchHN(searchQuery);
  res.render('search', {
    title: `Search results for: ${searchQuery}`,
    searchResults: results,
    searchQuery,
  });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Hacker news server started on port: ${server.address().port}`);
});

