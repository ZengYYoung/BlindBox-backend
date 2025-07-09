const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db.sqlite"
});

// 用户
const User = sequelize.define("User", {
    account: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    balance: { type: DataTypes.DECIMAL(10,2), defaultValue: 100 }
});

// 盲盒
const BlindBox = sequelize.define("BlindBox", {
    name: DataTypes.STRING,
    series: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL(10,2),
    stock: DataTypes.INTEGER
});

// 奖品
const Prize = sequelize.define("Prize", {
    blindboxId: DataTypes.INTEGER,
    prizeName: DataTypes.STRING,
    prizeImg: DataTypes.STRING,
    probability: DataTypes.FLOAT
});

// 订单
const Order = sequelize.define("Order", {
    userId: DataTypes.INTEGER,
    blindboxId: DataTypes.INTEGER,
    prizeId: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10,2),
    status: DataTypes.STRING
});

// 晒单
const PlayerShow = sequelize.define("PlayerShow", {
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    images: DataTypes.TEXT, // JSON字符串数组
    likes: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// 评论
const Comment = sequelize.define("Comment", {
    playershowId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT
});

BlindBox.hasMany(Prize, { foreignKey: "blindboxId" });
Prize.belongsTo(BlindBox, { foreignKey: "blindboxId" });

Order.belongsTo(User, { foreignKey: "userId" });
Order.belongsTo(BlindBox, { foreignKey: "blindboxId" });
Order.belongsTo(Prize, { foreignKey: "prizeId" });

PlayerShow.belongsTo(User, { foreignKey: "userId" });
PlayerShow.hasMany(Comment, { foreignKey: "playershowId" });
Comment.belongsTo(User, { foreignKey: "userId" });

module.exports = { sequelize, User, BlindBox, Prize, Order, PlayerShow, Comment };