const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const routes = require("./routes");
const { seed } = require("./seedData");
const path = require("path");
const fs = require("fs");

const app = express();

// CORS配置
app.use(cors({
    origin: 'http://localhost:5173', // 前端开发服务器地址
    credentials: true
}));

app.use(bodyParser.json());

// 静态文件服务
if (!fs.existsSync("images")) fs.mkdirSync("images");
app.use("/images", express.static(path.join(__dirname, "images")));

// API路由
app.use("/api", routes);

sequelize.sync().then(async () => {
    await seed();
    app.listen(3000, () => {
        console.log("Server started at http://localhost:3000");
    });
});