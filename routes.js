const express = require("express");
const router = express.Router();
const ctrl = require("./controllers");
const { auth } = require("./middleware");
const multer = require("multer");
const upload = multer({ dest: "images/" });
const { BlindBox, Prize } = require('./models');

// 用户认证
router.post("/auth/register", ctrl.register);
router.post("/auth/login", ctrl.login);

// 盲盒相关
router.get('/blindboxes', ctrl.listBlindBoxes);
router.get('/blindboxes/:id', async (req, res) => {
    const { BlindBox, Prize } = require('./models');
    const box = await BlindBox.findByPk(req.params.id, { include: Prize });
    if (!box) return res.status(404).json({ msg: '盲盒不存在' });
    res.json(box);
});
router.post('/blindboxes/:id/draw', auth, async (req, res) => {
    try {
        const { BlindBox, Prize, Order, User } = require('./models');
        const user = req.user;
        const blindbox = await BlindBox.findByPk(req.params.id);
        if (!blindbox) return res.status(404).json({ msg: '盲盒不存在' });
        if (blindbox.stock <= 0) return res.status(400).json({ msg: '无库存' });
        if (user.balance < blindbox.price) return res.status(400).json({ msg: '余额不足' });
        const prizes = await Prize.findAll({ where: { blindboxId: blindbox.id } });
        let rand = Math.random(), sum = 0, selected;
        for (let p of prizes) {
            sum += p.probability;
            if (rand <= sum) { selected = p; break; }
        }
        if (!selected) selected = prizes[prizes.length - 1];
        await blindbox.decrement("stock", { by: 1 });
        await user.decrement("balance", { by: blindbox.price });
        const order = await Order.create({
            userId: user.id,
            blindboxId: blindbox.id,
            prizeId: selected.id,
            price: blindbox.price,
            status: "已支付"
        });
        res.json({
            msg: "抽盒成功", prizeName: selected.prizeName, prizeImg: selected.prizeImg, orderId: order.id
        });
    } catch (e) {
        res.status(500).json({ msg: '抽盒失败，请重试' });
    }
});

// 订单
router.get("/orders", auth, ctrl.getOrders);

// 晒单
router.get("/playershows", ctrl.getPlayerShows);
router.post("/playershows", auth, ctrl.createPlayerShow);
router.post("/playershows/:id/like", auth, ctrl.likePlayerShow);
router.post("/playershows/:id/comment", auth, ctrl.commentPlayerShow);
router.get("/playershows/:id/comments", ctrl.getComments);

// 图片上传
router.post("/images", auth, upload.single("file"), (req, res) => {
    const url = `/images/${req.file.filename}`;
    res.json({ url });
});

module.exports = router;