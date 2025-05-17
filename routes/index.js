const router = require("express").Router();
const { NOT_FOUND_ERROR } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const {
  validateUserSignup,
  validateUserLogin,
} = require("../middlewares/validation");

const userRouter = require("./users");
const clothingItem = require("./clothingItems");

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserSignup, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res, next) => {
  next({
    statusCode: NOT_FOUND_ERROR,
    message: "Router not found",
  });
});

module.exports = router;
