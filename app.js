/*
应用程序启动(入口)文件
*/
//加载express模块
var express = require('express');
//加载swig模板
var swig = require('swig');
//加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载数据库模块
var mongoose = require('mongoose');
//加载cookies模块
var Cookies = require('cookies');
//创建app应用 => NodeJS Http.createServer()
var app = express();

var User = require('./models/User');

//设置静态文件托管
//当用户访问url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use('/public',express.static(__dirname + '/public'));

//配置应用模板
//第一参数:文件类型,第二个参数:解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录 第一个参数必须是views,第二个参数路径
app.set('views','./views');
//注册模板 第一个参数必须是view engine，第二个参数和app.engine方法中的文件类型一致
app.set('view engine','html');
//开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});

//body-parser设置
app.use(bodyParser.urlencoded({extended:false}))

//设置cookies
app.use(function(req,res,next){
	req.cookies = new Cookies(req,res);

	req.userInfo = {};
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));
			//获取当前用户是否为管理员
			User.findById(req.userInfo._id).then(function(userInfo){
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			})
		}catch(e){
			next();
		}

	}else{
		next();
	}
})

//后台管理
app.use('/admin',require('./routers/admin'));
//api
app.use('/api',require('./routers/api'));
//前台展示
app.use('/',require('./routers/main'));

//监听http请求
mongoose.connect('mongodb://localhost:27017/blog',function(err){
	if(err){
		console.log('数据库连接失败');
	}else{
		console.log('数据库连接成功');
		app.listen(8080);
	}
});
