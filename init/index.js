const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected Successfully");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(Mongo_url);
}

const intiDB = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "65b7932121ab3374d7b068c7" }));
    await listing.insertMany(initData.data);
    console.log("Data was initialized");
}

intiDB();