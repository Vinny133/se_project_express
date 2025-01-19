const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", auth, createItem);

// Get
router.get("/", getItems);

// Like
router.put("/:itemId/likes", auth, likeItem);

// Dislike
router.delete("/:itemId/likes", auth, dislikeItem);

// Delete
router.delete("/:itemId", auth, deleteItem);

module.exports = router;
