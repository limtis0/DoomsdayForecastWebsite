const express = require("express");

const api = express();
api.listen(5500, () => {
    console.log("API is up!");
});

api.get("/api/hi", (req, res) => {
    console.log(req);
    res.send("Hello, world!")
})
