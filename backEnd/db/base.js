/*
 * @Description: 
 * @Author: 袁文
 * @Date: 2021-06-14 07:35:42
 * @LastEditTime: 2021-10-01 20:25:06
 * @LastEditors: 袁文
 */
var mysql = require('mysql');
let connectBase={
      host     : 'localhost',
      user     : 'root',
      password : '123456',
      database : 'myfavorite'
}
let connection=mysql.createPool(connectBase)
module.exports= connection