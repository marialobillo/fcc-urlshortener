const express = require("express");
const router = express.Router();

const {
  getOriginalUrl,
  createShortUrl,
} = require("../controllers/urlsController");

router.route("/:shorturl").get(getOriginalUrl);
router.route("/").post(createShortUrl);

module.exports = router;
