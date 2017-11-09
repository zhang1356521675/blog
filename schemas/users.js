
var mongoose = require('mongoose');

//用户的表结构
var Schema = new mongoose.Schema({
	//用户名
	username: String,
	//密码
	password: String,
	//是否为管理员
	isAdmin:{
		type:Boolean,
		default:false
	}
})

module.exports = Schema;
