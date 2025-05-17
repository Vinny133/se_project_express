const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItems");

const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

// Create
router.post("/", auth, validateClothingItem, createItem);

// Get
router.get("/", getItems);

// Like
router.put("/:itemId/likes", auth, validateId, likeItem);

// Dislike
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

// Delete
router.delete("/:itemId", auth, validateId, deleteItem);

module.exports = router;
