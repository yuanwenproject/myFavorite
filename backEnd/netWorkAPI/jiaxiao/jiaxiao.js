var axios =require('axios');
function jiaxiaoData(requestParams){
    return new Promise((resolve,reject)=>{
      axios.get(`https://mnks.jxedt.com/get_question?index=`+requestParams)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    })
}
async function getJiaxiaoData(requestParams){
  var robortText=await jiaxiaoData(requestParams);
  // console.log('响应字段为',robortText.data);
  return robortText.data;
}
module.exports= getJiaxiaoData