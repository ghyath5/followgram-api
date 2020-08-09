import { IgApiClient, IgCheckpointError } from 'instagram-private-api'
import Storage from './gqlClient'
const AWS = require('aws-sdk');

let ig = null
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
});
async function saveSession(username,session){
  let params = {
    Bucket: process.env.AWS_BUCKET, 
    Key: `${username}.txt`,
    Body:JSON.stringify(session)
  }
  s3.putObject(params, function(err, data){
    if(err) console.log(err)
  });
}
async function loadSession(username){
  let params = {
    Bucket: process.env.AWS_BUCKET, 
    Key: `${username}.txt`
  }
  try {
    const file = await s3
      .getObject(params)
      .promise();
    if(!file || !file.Body){
      return false
    }
    return file.Body.toString('ascii');
  } catch (err) {
    return false
  }
  
}
const login = async (username, password)=>{
  let loged = false
  try{
    loged = await ig.account.login(username, password);
  }catch(e){
    if(e.response && e.response.body){
      let msg = e.response.body.message
      console.log(username,msg);
      if(msg === 'challenge_required'){
        try{
          await ig.challenge.auto(true);
        }catch(e){
          console.log(e)
        }
      }else if(msg.includes('password') && msg.includes('incorrect')){
        Storage.deleteUser(username)
      }
    }
    return false
  }
  if(!loged) return false;
  const serialized = await ig.state.serialize();
  delete serialized.constants;
  saveSession(username,serialized)
  return true
}
const globalLogin = async ({username,password})=>{
  ig = new IgApiClient();
  ig.state.generateDevice(username);
  await ig.simulate.preLoginFlow();
  let check = await loadSession(username)
  let loged = false
  if(check){
    console.log(username," exist");
    await ig.state.deserialize(JSON.parse(check));
    loged = await ig.account.currentUser()
    if(!loged){
      loged = await login(username,password)
    }
  }else{
    console.log(username," login new");
    loged = await login(username,password)
  }
  if(!loged){
    return false
  }
  
  return loged
}
export default {
  login:async (user)=>{
    return await globalLogin(user)
  },
  
  verifyChallenge: async({code,username})=>{
    ig.state.generateDevice(username);
    let status = await ig.challenge.sendSecurityCode(code)
    console.log(status)
    return status
  },

  follow: async (username)=>{
    let followers = await Storage.getFollowers(username)
    let count = 0
    await asyncForEach(followers,async (follower)=>{
      try{
        let loged = await globalLogin({username:follower.username,password:follower.password})
        if(!loged) return
        let id = await ig.user.getIdByUsername(username)
        let is = await ig.friendship.create(id)
        if(is){
          Storage.updateUser({
              where:{
                  id:{_eq:follower.id}
              },
              set:{
                last_activity:new Date().toISOString()
              }
          })
          count++
        }
      }catch(e){
        console.log(e);
      }
    })
    if(count){
      let dat = new Date()
      Storage.updateUser({
        where:{
          username:{_eq:username}
        },
        set:{
          can: new Date(dat.setDate(dat.getDate()+1)).toISOString()
        }
      })
    }
    return count
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}