const express = require("express");
const ProductRouter = express.Router();
const Product = require("../models/product-schema");
const auth = require("../middleware/auth");
const multer = require("multer");

// Upload Product
ProductRouter.post("/", auth, async (req, res, next) => {
  try {
    const { writer, title, description, category, price, color, size, images } =
      req.body;
    const product = new Product({
      writer,
      title,
      description,
      category,
      price,
      color,
      size,
      images,
    });
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// Image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("file");

ProductRouter.post("/image", auth, async (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ fileName: res.req.file.filename });
  });
});

// GET Product with Filtering
ProductRouter.get("/", async (req, res, next) => {
  const order = req.query.order ? req.query.order : "desc";
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const term = req.query.searchTerm;

  let findArgs = {};
  for (let key in req.query.filters) {
    if (req.query.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          //Greater than equal
          $gte: req.query.filters[key][0],
          //Less than equal
          $lte: req.query.filters[key][1],
        };
      } else {
        findArgs[key] = req.query.filters[key];
      }
    }
  }

  if (term) {
    findArgs["$text"] = { $search: term };
  }

  try {
    const products = await Product.find(findArgs)
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit);

    const productsTotal = await Product.countDocuments(findArgs);
    const hasMore = skip + limit < productsTotal ? true : false;

    return res.status(200).json({
      products,
      hasMore,
    });
  } catch (error) {
    next(error);
  }
});

// GET Product from Id
ProductRouter.get("/:id", async (req, res, next) => {
  const type = req.query.type;
  let productIds = req.params.id;

  if (type == "array") {
    let ids = productIds.split(",");
    productIds = ids.map((item) => {
      return item;
    });
  }
  try {
    const product = await Product.find({ _id: { $in: productIds } }).populate(
      "writer"
    );
    return res.status(200).send(product);
  } catch (error) {
    next(error);
  }
});

module.exports = ProductRouter;
