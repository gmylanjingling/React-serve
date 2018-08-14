/*路由模块*/
const express = require('express');
const router = express.Router();
//引入md5加密函数库
const md5 = require('blueimp-md5');
//查询时过滤出指定属性
const filter = {password:0,__v:0};
/*
const models = require('../db/models');
const UserModel = models.UserModel;
*/
const {UserModel} = require('../db/models');
//require()对象

//注册路由
router.post('/register',function(req,res){
  //1.获取请求参数数据(username,password,type)
  const {username,password,type} = req.body;
  //2.处理数据-根据username查询数据可，看是否存在user, 有返回失败的信息；没有保存信息，之后返回成功的信息
  UserModel.findOne({username},function(err,userDoc){
    //3.返回响应----所有没有名字的函数都可以写成箭头函数
    if(userDoc){
      res.send({code:1,msg:'此用户已存在'})//code是数据是否正常的标识
    }else{
      //如果不存在，可以注册；将提交到的user保存到数据库中
      new UserModel({username,password:md5(password),type}).save((err,userDoc)=>{//生成一个cookie(userid:user._id),并交给浏览器保存-->持久化cookie，浏览器会保存在本地

        res.cookie('userid',userDoc._id,{maxAge:1000*60*60*24*7});
        //保存成功返回成功的响应数据：user
        res.send({code:0,data:{_id:userDoc._id,username,password}})
      })//返回的数据中不要携带psd
    }
  })
});
//登录路由
router.post('/login',function(req,res){
  //获取请求参数数据(username,password)
  const {username,password} = req.body;
  //处理数据--->响应数据---》根据username查询数据可，看是否存在user
  UserModel.findOne({username,password:md5(password)},(err,userDoc)=>{
    //如果user没有，返回错误提示
    if(!userDoc){
      res.send({code:1,msg:'用户名或密码错误'})//code是数据是否正常的标识
    }else{
      //生成cookie(userid:user._id),并交给浏览器保管
      res.cookie('userid',userDoc._id,{maxAge:1000*60*60*24*7});
      //若优质，返回user
      res.send({code:0,data:userDoc})//user中没有password
      //如果user有值，返回user
    }
  })
})
module.exports = router;
