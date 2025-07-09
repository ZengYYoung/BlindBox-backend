const express = require("express");
const router = express.Router();
const ctrl = require("./controllers");
const { auth } = require("./middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// 用户
router.post("/auth/register", ctrl.register);
router.post("/auth/login", ctrl.login);

// 盲盒
router.get("/blindboxes", ctrl.listBlindBoxes);
router.get("/blindboxes/:id", ctrl.getBlindBoxDetail);
router.post("/blindboxes/:id/draw", auth, ctrl.drawBlindBox);

// 订单
router.get("/orders", auth, ctrl.getOrders);

// 晒单
router.get("/playershows", ctrl.getPlayerShows);
router.post("/playershows", auth, ctrl.createPlayerShow);
router.post("/playershows/:id/like", auth, ctrl.likePlayerShow);
router.post("/playershows/:id/comment", auth, ctrl.commentPlayerShow);
router.get("/playershows/:id/comments", ctrl.getComments);

// 图片上传
router.post("/upload", auth, upload.single("file"), (req, res) => {
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
});

module.exports = router;