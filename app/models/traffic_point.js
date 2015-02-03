/* Traffic Volume API */
/* by Brian Cottrell  */
/* 02-02-2015         */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrafficSchema = new Schema({
	latitude: Number,
	longitude: Number,
	count: Number
});

module.exports = mongoose.model('TrafficPoint', TrafficSchema);