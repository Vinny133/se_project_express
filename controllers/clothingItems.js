const mongoose = require("mongoose");
const clothingItem = require("../models/clothingItem");
const {
  DEFAULT_ERROR,
  INVALID_ERROR_CODE,
  NOT_FOUND_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        return res.status(INVALID_ERROR_CODE).send({ message: e.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(INVALID_ERROR_CODE).send({ message: "Invalid ID" });
  }

  return clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      console.error(e);

      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: e.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(INVALID_ERROR_CODE).send({ message: "Invalid ID" });
  }

  return clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      console.error(e);

      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: e.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  console.log(`Attempting to delete item: ${itemId} by user: ${userId}`);

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(INVALID_ERROR_CODE).send({ message: "Invalid ID " });
  }

  return clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        console.log(`User ${userId} is not the owner of item ${itemId}`);
        return Promise.reject({
          status: FORBIDDEN_ERROR,
          message: "You're not allowed to delete this item",
        });
      }

      return clothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.status(200).send({ data: "Item successfully deleted" }))
    .catch((e) => {
      console.error(e);

      if (e.status === FORBIDDEN_ERROR) {
        return res.status(FORBIDDEN_ERROR).send({ message: e.message });
      }
      if (e instanceof mongoose.Error.CastError) {
        return res
          .status(INVALID_ERROR_CODE)
          .send({ message: "Invalid item ID format" });
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
};
