 const express=require('express');
const pool=require('../pool.js');
var router=express.Router();

//添加路由
//1.用户注册
router.post('/reg',function(req,res){
	//1.1获取post请求数据
	var obj=req.body;
	console.log(obj);
	//1.2验证数据是否为空
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		//阻止往后执行
		return;
	}else if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}else if(!obj.email){
		res.send({code:403,msg:'email required'});
		return;
	}else if(!obj.phone){
		res.send({code:404,msg:'phone required'});
		return;
	}
	//1.3执行SQL语句
	pool.query('INSERT INTO xz_user SET ?',[obj],function(err,result){
		if(err) throw err;
		console.log(result);
		//如果注册成功
		if(result.affectedRows>0){
			res.send({code:200,msg:'register suc'});
			return;
		}
	});
	//res.send('注册成功');
});

//2.用户登录
router.post('/login',function(req,res){
	//2.1获取post请求的数据
	var obj=req.body;
	console.log(obj);
	//2.2判断数据是否为空
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		return;
	}else if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}
	//执行SQL语句，查询数据库比对数据是否匹配
	pool.query('SELECT *FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],function(err,result){
		if(err) throw err;
		//console.log(result);
		//判断是否登录成功
		if(result.length>0){
			res.send({code:200,msg:'login suc'});
		}else{
			res.send({code:301,msg:'login err'});
		}
	});
});

//3.检索用户
router.get('/detail',function(req,res){
	//3.1获取数据
	var obj=req.query;
	console.log(obj);
	//3.2判断数据是否为空
	if(!obj.uid){
		res.send({code:405,msg:'uid required'});
		return;
	}
	//3.3执行SQL语句
	pool.query('SELECT *FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if(err) throw err;
		console.log(result);
		//判断是否检索到用户，如果检索到，把该用户的对象响应到浏览器，否则响应检索不到
		if(result.length>0){
			res.send(result[0]);
		}else{
			res.send({code:301,msg:'can\'t find'});
		}
	});
});

//4.修改用户
router.get('/update',function(req,res){
	//获取数据
	var obj=req.query;
	console.log(obj);
	//判断数据是否为空,遍历对象
	var i=400;
	for(var key in obj){
		i++;
		//如果属性值为空，则提示属性名是必须的
		if(!obj[key]){
			res.send({code:i,msg:key+' required'});
			return;
		}
	}
	//执行SQL语句
	pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send('修改成功');
		}else{
			res.send('修改失败');
		}
	});
});

//5.分页查询
router.get('/list',function(req,res){
	//获取数据
	var obj=req.query;
	console.log(obj);
	//如果页码为空，默认值是1；如果大小为空，默认值是3
	if(!obj.pno){
		obj.pno=1;
	}
	if(!obj.size){
		obj.size=3;
	}
	//转整型
	obj.pno=parseInt(obj.pno);
	obj.size=parseInt(obj.size);
	//计算开始查询的值
	var start=(obj.pno-1)*obj.size;
	//执行SQL语句
	pool.query('SELECT *FROM xz_user LIMIT ?,?',[start,obj.size],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});

//6.删除用户
router.get('/delete',function(req,res){
	//获取数据
	var obj=req.query;
	console.log(obj);
	//判断数据是否为空
	if(!obj.uid){
		res.send({code:301,msg:'uid required'});
		return;
	}
	//执行SQL语句
	pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if(err) throw err;
		console.log(result);
		if(result.affectedRows>0){
			res.send('删除成功');
		}else{
			res.send('删除失败');
		}
	});

});
//导出路由
module.exports=router;