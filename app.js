const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize, BlindBox, Prize } = require("./models");
const routes = require("./routes");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 静态文件服务
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", routes);

// 首次自动填充盲盒和奖品数据（只填充一次）
async function seed() {
    if (await BlindBox.count() === 0) {
        const box = await BlindBox.create({
            name: "幸运猫盲盒", series: "动物系列",
            image: "https://cdn.pixabay.com/photo/2017/01/06/19/15/cat-1958376_1280.jpg",
            description: "各种可爱的猫咪公仔盲盒", price: 59, stock: 50
        });
        await Prize.bulkCreate([
            { blindboxId: box.id, prizeName: "稀有猫", prizeImg: "https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.jpg", probability: 0.05 },
            { blindboxId: box.id, prizeName: "普通猫", prizeImg: "https://cdn.pixabay.com/photo/2015/03/27/13/16/cat-693651_1280.jpg", probability: 0.45 },
            { blindboxId: box.id, prizeName: "幸运猫", prizeImg: "https://cdn.pixabay.com/photo/2016/11/18/15/27/cat-1839937_1280.jpg", probability: 0.50 }
        ]);
    }
}

sequelize.sync().then(async () => {
    await seed();
    app.listen(3000, () => {
        console.log("Server started at http://localhost:3000");
    });
});