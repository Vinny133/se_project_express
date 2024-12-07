const clothingItem = require("../models/clothingItem");
const mongoose = require("mongoose");

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
        return res.status(400).send({ message: e.message });
      }
      return res.status(500).send({ message: e.message, e });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: err.message, err });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid ID" });
  }

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => {
      return res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: e.message, e });
      }
      return res.status(500).send({ message: e.message, e });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid ID" });
  }

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => {
      return res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: e.message, e });
      }
      return res.status(500).send({ message: e.message, e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid ID " });
  }

  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({});
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "CastError") {
        return res.status(400).send({ message: e.message, e });
      } else if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: e.message, e });
      }
      return res.status(500).send({ message: e.message, e });
    });
};

module.exports = {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
};
