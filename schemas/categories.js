var mongoose = require('mongoose');

//添加分类的表结构
var Schema = new mongoose.Schema({
	//分类名
	name: String
})

module.exports = Schema;