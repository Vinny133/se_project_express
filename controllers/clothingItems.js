const mongoose = require("mongoose");
const clothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const createItem = (req, res, next) => {
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        return next(new BadRequestError(e.message));
      }
      return next(e);
    });
};

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid ID"));
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
        return next(new NotFoundError(e.message));
      }
      return next(e);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid ID"));
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
        return next(new NotFoundError(e.message));
      }
      return next(e);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  console.log(`Attempting to delete item: ${itemId} by user: ${userId}`);

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid ID"));
  }

  return clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        console.log(`User ${userId} is not the owner of item ${itemId}`);
        return Promise.reject(
          new Error("Forbidden: You're not allowed to delete this item")
        );
      }

      return clothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.status(200).send({ data: "Item successfully deleted" }))
    .catch((e) => {
      console.error(e);

      if (e.message.startsWith("Forbidden")) {
        return next(new ForbiddenError(e.message));
      }
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(e.message));
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(e.message));
      }
      return next(e);
    });
};

module.exports = {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
};
