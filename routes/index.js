const router = require("express").Router();
const auth = require("../middlewares/auth");
const { NOT_FOUND_ERROR } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

const userRouter = require("./users");
const clothingItem = require("./clothingItems");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", auth, userRouter);
router.use("/items", auth, clothingItem);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Router not found" });
});

module.exports = router;
