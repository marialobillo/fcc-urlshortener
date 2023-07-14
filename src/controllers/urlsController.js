const UrlModel = require("../models/Url");
const dns = require('node:dns/promises')
const { client } = require("../db/redis");

const createShortUrl = async (req, res) => {
  try {
    const url_requested = new URL(req.body.url);
    const hostnameURL = url_requested.hostname;

    await dns.lookup(hostnameURL).then((result) => {})
    const urlCounter = await UrlModel.countDocuments();
    const url = await UrlModel.create({
      original_url: req.body.url,
      short_url: urlCounter + 1,
    });
    res.status(201).json({
      original_url: url.original_url,
      short_url: url.short_url,
    });
  } catch (error) {
    res.status(200).json({ error: "invalid url" });
  }
}

const getOriginalUrl = async (req, res) => {
  try {
    const short_url = req.params.shorturl;
    const url_from_redis = await client.hGetAll(`url-session:${short_url}`);
    if (!url_from_redis) {
      res.writeHead(302, {
        Location: url_from_redis.original_url,
      });
      return res.end();
    }
    // if not in redis, check if data is in mongodb
    const url_from_mongo = await UrlModel.findOne({ short_url });
    if (!url_from_mongo) {
      return res
        .status(404)
        .json({ error: "No short URL found for the given input" });
    }
    // if in mongodb, add to redis
    await client.hSet(`url-session:${short_url}`, {
      original_url: url_from_mongo.original_url,
      short_url: url_from_mongo.short_url,
    });
    res.writeHead(302, {
      Location: url_from_mongo.original_url,
    });
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createShortUrl,
  getOriginalUrl,
};
