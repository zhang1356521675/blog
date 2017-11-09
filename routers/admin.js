var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');

router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		res.send('对不起，你没有管理员权限');
		return;
	}
	next();
})

//首页
router.get('/',function(req,res){
	res.render('admin/index',{
		userInfo:req.userInfo
	})
})

//用户管理
router.get('/user',function(req,res){
	//读取数据库用户信息
	//limit(Number)限制获取的数据条数
	//skip(1)忽略数据的条数
	/*
	*每页显示2条
	*第一页:1-2数据 skip(0)
	*第二页:3-4数据 skip(2)
	*/

	var page = Number(req.query.page || 1);
	var limit = 10;
	var pages = 0;

	User.count().then((count)=>{
		//总页数
		pages = Math.ceil(count / limit);
		//取值不超过pages
		page = Math.min(page,pages);
		//取值不小于1
		page = Math.max(page,1);

		var skip = (page-1)*limit;

		User.find().limit(limit).skip(skip).then(function(users){
			// console.log(users)
			res.render('admin/user_index',{
				userInfo:req.userInfo,
				users:users,

				count:count,
				limit:limit,
				page:page,
				pages:pages
			})
		})	
	})	
})

//分类首页
router.get('/category',function(req,res){


	var page = Number(req.query.page || 1);
	var limit = 10;
	var pages = 0;

	Category.count().then((count)=>{
		//总页数
		pages = Math.ceil(count / limit);
		//取值不超过pages
		page = Math.min(page,pages);
		//取值不小于1
		page = Math.max(page,1);

		var skip = (page-1)*limit;

		Category.find().limit(limit).skip(skip).then(function(categories){

			res.render('admin/category_index',{
				userInfo:req.userInfo,
				categories:categories,

				count:count,
				limit:limit,
				page:page,
				pages:pages
				
			})
		})	
	})

})

//添加分类
router.get('/category/add',function(req,res){

	res.render('admin/category_add',{
		userInfo:req.userInfo
	})

})

//添加分类的提交
router.post('/category/add',function(req,res){
	var name = req.body.name || '';

	if(name == ''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'输入的内容不能为空'
		});
		return;
	}

	//数据库中是否存在相同分类名
	Category.findOne({
		name:name
	}).then((rs)=>{
		if(rs){
			//已经存在
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'分类名称已经存在了'
			})
			return Promise.reject();
		}else{
			//不存在
			return new Category({
				name:name
			}).save();
		}
	}).then(function(newCategory){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'分类保存成功',
			url:'/admin/category'
		})
	})

})

module.exports = router;