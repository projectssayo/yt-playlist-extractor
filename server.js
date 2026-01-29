import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
const PORT = process.env.PORT || 7452;

app.post("/basic-data", async (req, res) => {
    console.log(req.body);
    let api = await fetch(`https://sayo-adv-yt.onrender.com/basic?url=${encodeURIComponent(req.body.url)}`)
    console.log(`https://sayo-adv-yt.onrender.com/basic?url=${encodeURIComponent(req.body.url)}`);
    let api_data = await api.json();
    res.json({ ejs_server: "ok" , api_data });
});

app.post("/adv-data", async (req, res) => {
    console.log(req.body);
    console.log(`https://sayo-adv-yt.onrender.com/basic?url=${encodeURIComponent(req.body.url)}`);
    let api = await fetch(`https://sayo-adv-yt.onrender.com/adv?url=${encodeURIComponent(req.body.url)}`)
    let api_data = await api.json();
    res.json({ ejs_server: "ok" , api_data });
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "applying_deep4_3.html"));
    // create a fire and forget to access    https://sayo-adv-yt.onrender.com/info
    fetch("https://sayo-adv-yt.onrender.com/info")
    .catch(() => {}); // ignore errors

});


app.get("/about-us", (req, res) => {
    res.sendFile(path.join(__dirname, "about_us.html"));
})

app.get("/404-page", (req, res) => {
    res.sendFile(path.join(__dirname, "404.html"));
})


app.listen(PORT, () => {
    console.log(`hi server on http://localhost:${PORT}`);
});

