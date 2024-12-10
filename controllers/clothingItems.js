const mongoose = require("mongoose");
const clothingItem = require("../models/clothingItem");
const {
  DEFAULT_ERROR,
  INVALID_ERROR_CODE,
  NOT_FOUND_ERROR,
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
      return res.status(DEFAULT_ERROR).send({ message: e.message, e });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR).send({ message: err.message, err });
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
        return res.status(NOT_FOUND_ERROR).send({ message: e.message, e });
      }
      return res.status(DEFAULT_ERROR).send({ message: e.message, e });
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
        return res.status(NOT_FOUND_ERROR).send({ message: e.message, e });
      }
      return res.status(DEFAULT_ERROR).send({ message: e.message, e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(INVALID_ERROR_CODE).send({ message: "Invalid ID " });
  }

  return clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }
      return res.status(200).send({});
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "CastError") {
        return res.status(INVALID_ERROR_CODE).send({ message: e.message, e });
      }
      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: e.message, e });
      }
      return res.status(DEFAULT_ERROR).send({ message: e.message, e });
    });
};

module.exports = {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
};
