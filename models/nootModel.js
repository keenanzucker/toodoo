var mongoose = require("mongoose");

var noot = mongoose.Schema({
	
	text: String,
	time : { type : Date, default: Date.now },
	done: Boolean

}, {collection: "noots"});

module.exports = mongoose.model("noot", noot);