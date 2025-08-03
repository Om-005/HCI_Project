require('dotenv').config(); // 🔼 Must come before any use of process.env


const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());

// ✅ Set CSP early so it applies to all routes and assets
app.use((req, res, next) => {
res.setHeader(
  "Content-Security-Policy",
  "default-src 'self'; " +
  "font-src 'self' data: https://fonts.gstatic.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "script-src 'self'; " +
  "img-src 'self' data: https://yt3.googleusercontent.com https://yt3.ggpht.com https://i.ytimg.com https://kbtcoe.org/wp-content/uploads/2016/11/Nitinujgare.jpg https://kbtcoe.org;"
);

  next();
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const apiKey = process.env.YOUTUBE_API_KEY;

  console.log("🔥 API Key:", apiKey);
  console.log("🔍 Search Query:", query);

  if (!query) return res.status(400).json({ error: 'Missing search query' });

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=long&maxResults=12&key=${apiKey}`;
  console.log("🌐 Request URL:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("📦 API Response:", data);

    if (!response.ok) {
      return res.status(500).json({ error: 'YouTube API Error', details: data });
    }

    res.json(data);
  } catch (error) {
    console.error("❌ Fetch Error:", error.message);
    res.status(500).json({ error: 'Fetch failed', message: error.message });
  }
});


// Optional: handle 404s
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
