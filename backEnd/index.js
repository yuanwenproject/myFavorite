/*
 * @Description: 
 * @Author: 袁文
 * @Date: 2021-10-01 20:06:16
 * @LastEditTime: 2021-10-30 11:01:49
 * @LastEditors: 袁文
 */
var express = require('express');
var app = new express();
var moment = require('moment');
var insertData = require('./dbOperation/insertAdvanced.js');
var searchData = require('./dbOperation/searchAdvanced.js');
var updateData = require('./dbOperation/updateAdvanced.js');
var deleteData = require('./dbOperation/deleteAdvanced.js');
var getMusic = require('./netWorkAPI/music/music.js');
var getWallpaper = require('./netWorkAPI/wallpaper/wallpaper.js');
var getJiaxiaoData = require('./netWorkAPI/jiaxiao/jiaxiao.js')
var qs = require('qs');
const bodyParser = require('body-parser');
//使用cors解除跨域问题
const cors = require('cors');
app.use(cors());
//配置body-parser模块
app.use(bodyParser.urlencoded({
    extended: false
}));
app.get('/', async (req, res, next) => {
    res.json({
        data: 'hello world!'
    })
    next();
})
// 电影操作

app.get('/searchRelateMovie', async (req, res, next) => {
    var relatedName = req.query.relatedName;
    var relateSql = `select * from movies WHERE v_title LIKE '%${relatedName}%' And listNum='1'`
    let relatedList = await searchData(relateSql);
    res.json({
        data: relatedList
    })
    next()
})
app.get('/movies/searchAll', async (req, res, next) => {
    var searchAllSql = `select * from movies where listNum=1`;
    var allResult = await searchData(searchAllSql);
    res.json({
        data: allResult,
        code: 20000
    })
    next();
})
app.get('/movies/movieDetails', async (req, res, next) => {
    var movieName = req.query.movieName;
    var detailsSql = `select * from movies where v_title = '${movieName}' order by listNum desc`;
    var detailsResult = await searchData(detailsSql);
    res.json({
        data: detailsResult,
        code: 20000
    })
})

app.get('/modifyProp', async (req, res, next) => {
    var modifyMovieName = req.query.v_title;
    var modifyProp = req.query.modifyProp;
    var modifyPropValue = req.query.modifyPropValue;
    var modifySql = `update movies set ${modifyProp}='${modifyPropValue}' where v_title ='${modifyMovieName}'`;
    var modifyResult = await updateData(modifySql);
    res.json({
        data: modifyResult
    })
    next()
})
app.get('/deleteMovie', async (req, res, next) => {
    var deleteName = req.query.v_title;
    console.log('接收参数为:', deleteName)
    var deleteSql = `delete from movies where v_title='${deleteName}'`
    var deleteRes = await deleteData(deleteSql);
    res.json({
        data: deleteRes
    })
    next()
})

// 驾校数据获取
app.get('/insertJiaxiaoData', (req, res, next) => {
    let timer = null,count = 1
    let jiaxiaoData = []
    timer = setInterval(async () => {
        let temp_data = await getJiaxiaoData(count);
        let paramArr = Object.values(temp_data)
        if(!temp_data.sinaimg){
            paramArr.splice(13,0,null)
        }
        jiaxiaoData.push(paramArr)
        count++;
        if (count == 201) {
            clearInterval(timer)
            let result = insertData("insert into jiaxiao (`id`,`question`,`a`,`b`,`c`,`d`,`e`,`f`,`g`,`right`,`ta`,`cid`,`imageurl`,`sohuimg`,`sinaimg`,`bestanswer`,`bestanswerid`,`chapter`,`options`,`type`) VALUES ?", jiaxiaoData)
            // let result = insertData(`insert into jiaxiao SET ?`, jiaxiaoData)
            res.json({
                data: jiaxiaoData
            })
            next()
        }
    }, 300)


    
    
})
// 游戏操作

app.get('/searchGame', async (req, res, next) => {
    var searchGameName = req.query.g_title;
    var searchGameSql = `select * from games where g_title like '%${searchGameName}%'`;
    var searchResult = await searchData(searchGameSql);
    res.json({
        data: searchResult,
        code: 20000
    })
    next()
})
app.get('/updateGameProp', async (req, res, next) => {
    var updateGameName = req.query.updateGameName;
    var updateGameProp = req.query.gameProp;
    var updateGamePropValue = req.query.gamePropValue;
    console.log(updateGameName, updateGameProp, updateGamePropValue)
    var updateGameSql = `update games set ${updateGameProp} = '${updateGamePropValue}' where g_title like '%${updateGameName}%'`
    var updateGameResult = await updateData(updateGameSql);
    res.json({
        data: updateGameResult
    })
    next();
})
app.get('/deleteGame', async (req, res, next) => {
    var deleteGameName = req.query.deleteGameName;
    var deleteGameSql = `delete from games where g_title like '%${deleteGameName}%'`
    var deleteGameResult = await deleteData(deleteGameSql);
    res.json({
        data: deleteGameResult
    })
    next();
})
app.get('/game/searchAll', async (req, res, next) => {
    var searchAllGameSql = `select * from games`;
    var allGameData = await searchData(searchAllGameSql);
    console.log("allGameData为:", allGameData)
    res.json({
        data: allGameData,
        code: 20000
    })
})
// 音乐操作
app.get('/music/search', async (req, res, next) => {
    var musicParams = qs.parse(req.query);
    console.log("musicParams的值为:", req.query)
    musicParams.page = parseInt(musicParams.page)
    var musicalResult = await getMusic(qs.stringify(musicParams));
    // console.log("音乐数据为:",musicalResult);
    res.json({
        data: musicalResult,
        code: 20000
    })
    next();
})
// 壁纸操作
app.get('/wallpaper/search', async (req, res, next) => {
    var wallpaperParams = req.query;
    // console.log("壁纸请求参数为:",qs.stringify(wallpaperParams));
    var wallPaperData = await getWallpaper(qs.stringify(wallpaperParams));
    // console.log("壁纸数据为:",wallPaperData);
    res.json({
        data: wallPaperData,
        code: 20000
    })
    next();
})
// 用户操作
app.post('/user/login', async (req, res, next) => {
    var userParam = req.body;
    // console.log("用户登陆请求参数为:",userParam.username);
    var userSql = `select * from users where name ='${userParam.username}'`;
    var userResult = await searchData(userSql);
    // console.log("用户数据为:",userResult);
    res.json({
        data: userResult[0],
        code: 20000
    })
    next();
})
app.get('/user/info', async (req, res, next) => {
    // var userParam = req.body;
    // console.log("用户登陆请求参数为:",userParam.username);
    // console.log("用户数据请求参数:",req.query.token)
    var userSql = `select * from users where name ='yuanwen'`;
    var userResult = await searchData(userSql);
    // console.log("用户数据为:",userResult);
    res.json({
        data: userResult[0],
        code: 20000
    })
    next();
})
// 首页操作
app.get('/dashboard/banner', async (req, res, next) => {
    var bannerSql = `select * from banners limit 4`;
    var bannerResult = await searchData(bannerSql);
    res.json({
        data: bannerResult,
        code: 20000
    })
    next();
})
app.get('/dashboard/dataStatistic', async (req, res, next) => {
    var dataStatistic = [];
    var tempArr = [];
    var movieCountSql = `select count(*) as count from movies where listNum = 1`
    tempArr[0] = await searchData(movieCountSql);
    var gameCountSql = `select count(*) as count from games`
    tempArr[1] = await searchData(gameCountSql);
    // console.log("计数的数据为:",tempArr);
    tempArr.forEach((item, index) => {
        dataStatistic.push(item[0].count);
    })
    res.json({
        data: dataStatistic,
        code: 20000
    })
    next();
})
app.get('/dashboard/hotThing', async (req, res, next) => {
    var dataStatistic = [];
    var movieCountSql = `select * from movies where listNum = 1 limit 5`
    dataStatistic[0] = await searchData(movieCountSql);
    var gameCountSql = `select * from games limit 5`
    dataStatistic[1] = await searchData(gameCountSql);
    res.json({
        data: dataStatistic,
        code: 20000
    })
    next();
})
app.listen(3000, () => {
    console.log("监听3000端口--http://localhost:3000/  数组插入记得使用嵌套数组[[]]");
})