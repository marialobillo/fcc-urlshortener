const UrlModel = require('../models/Url');
const dns = require('dns');

const createShortUrl = async (req, res) => {
    try {
        const url = new URL(req.body.url);
        const hostnameURL = url.hostname;
        dns.lookup(
            hostnameURL, 
            async (error) => {
                if (!error) { 
                    const urlCounter = await UrlModel.countDocuments()
                    const url = await UrlModel.create({ 
                        original_url: req.body.url,
                        short_url: urlCounter + 1
                    })
                    res.status(201).json({ 
                        original_url: url.original_url, 
                        short_url: url.short_url 
                    }) 
                } 
            })
    } catch (error) {  
        res.status(500).json({ error })
    }
}

const getOriginalUrl = async (req, res) => {
    try {
        const short_url = req.params.shorturl;
        const url = await UrlModel.findOne({ short_url })
        res.writeHead(301, {
            Location: url.original_url
          }).end();
        //res.status(201).json({ message: url.original_url })
    } catch (error) {
        res.status(500).json({ error })
    }
}


module.exports = {
    createShortUrl,
    getOriginalUrl,
}