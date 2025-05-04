const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Proxy route
app.post("/proxy", async (req, res) => {
  const { url, method = "GET", headers = {}, body } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing target URL" });
  }

  try {
    const axiosResponse = await axios({
      url,
      method,
      headers,
      data: method !== "GET" && method !== "HEAD" ? body : undefined,
      responseType: "json", // adjust if needed
      validateStatus: () => true, // allow all status codes through
    });

    res.set(axiosResponse.headers);
    res.status(axiosResponse.status).send(axiosResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`CORS proxy server running at http://localhost:${PORT}`);
});
