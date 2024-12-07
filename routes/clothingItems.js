const router = require("express").Router();

const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItems");

//Create
router.post("/", createItem);

//Get
router.get("/", getItems);

//Like
router.put("/:itemId/likes", likeItem);

//Dislike
router.delete("/:itemId/likes", dislikeItem);

//Delete
router.delete("/:itemId", deleteItem);

module.exports = router;
