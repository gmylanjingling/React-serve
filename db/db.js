//引入mongoose
const mongoose = require('mongoose');
//连接指定数据库--->有的连接，没有创建
mongoose.connect('mongodb://localhost:27017/test2');
//获取连接对象
const conn = mongoose.connection;
const md5 = require('blueimp-md5');
//绑定监听
conn.on('connected',function(){
  console.log('数据库连接成功')
});

//创建集合

//创建Schema约束对象
const userSchema = mongoose.Schema({
  username:{type:String,Require:true},
  password:{type:String,Require:true},
  type:{type:String,Require:true},
});
//定义Model与集合对应，操作集合
const UserModel = mongoose.model('user',userSchema);//集合名users
function testSave() {
  const user = {
    username: '小明',
    password: md5('abc'),
    type: '大神'
  };
//定义文档对象
  const userModel = new UserModel(user);
//保存到数据库
  userModel.save(function (err, user) {
    console.log('save', err, user);
  });
}
//testSave();
//通过Module.find（）和findOne（）查找多个[]或一个数据{}-->对象
//查找多个
UserModel.find(function(err,users){
  console.log('find()',err,users)
});
UserModel.findOne(function(err,user){
  console.log('findOne',err,user)
})
// 3.3. 通过Model的findByIdAndUpdate()更新某个数据
function testUpdate() {
  UserModel.findByIdAndUpdate({_id: '5ae1241cf2dd541a8c59a981'}, {username: 'yyy'}, function (err, user) {
    console.log('findByIdAndUpdate()', err, user)
  })
}

// 3.4. 通过Model的remove()删除匹配的数据
function testDelete() {
  UserModel.remove({_id: '5ae1241cf2dd541a8c59a981'}, function (err, result) {
    console.log('remove()', err, result)
  })
}

exports.UserModel = UserModel;