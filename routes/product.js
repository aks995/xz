const express=require('express');
const pool=require('../pool.js');
var router=express.Router();

//商品详情
router.get('/detail',function(req,res){
	//3.1获取数据
	var obj=req.query;
	console.log(obj);
	//3.2判断数据是否为空
	if(!obj.lid){
		res.send({code:405,msg:'lid required'});
		return;
	}
	//3.3执行SQL语句
	pool.query('SELECT lid,title,price FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
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

//增加商品
router.post('/add',function(req,res){
	//获取post请求的数据
	var obj=req.body;
	console.log(obj);
	//判断数据是否为空
	var i=400;
	for(var key in obj){
		i++;
		if(!obj[key]){
			res.send({code:i,msg:key+' required'});
			return;
		}
	}
	//执行SQL语句
	pool.query('INSERT INTO xz_laptop SET ?',[obj],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send('添加成功');
		}else{
			res.send('添加失败');
		}
	});
});

//删除商品
router.get('/delete',function(req,res){
	//获取数据
	var obj=req.query;
	console.log(obj);
	//判断数据是否为空
	if(!obj.lid){
		res.send({code:301,msg:'lid required'});
		return;
	}
	//执行SQL语句
	pool.query('DELETE FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send('删除成功');
		}else{
			res.send('删除失败');
		}
	});
});

//修改商品内容
router.get('/update',function(req,res){
	//获取数据
	var obj=req.query;
	console.log(obj);
	//判断数据是否为空
	var i=400;
	for(var key in obj){
		i++;
		if(!obj[key]){
			res.send({code:i,msg:key+' required'});
			return;
		}
	}
	//执行SQL语句
	pool.query('UPDATE xz_laptop SET ? WHERE lid=?',[obj,obj.lid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send('修改成功');
		}else{
			res.send('修改失败');
		}
	});
});

//分页查询
router.get('/list',function(req,res){
	var obj=req.query;
	console.log(obj);
	var pno=obj.pno;
	var size=obj.size;
	if(!pno){
		pno=1;
	}
	if(!size){
		size=9;
	}
	//console.log(pno,size);
	pno=parseInt(pno);
	size=parseInt(size);
	var start=(pno-1)*size;
	//执行SQL语句
	pool.query('SELECT lid,price,title FROM xz_laptop LIMIT ?,?',[start,size],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});

//导出路由对象
module.exports=router;
