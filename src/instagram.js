import { IgApiClient, IgCheckpointError } from 'instagram-private-api'
import Storage from './gqlClient'
const AWS = require('aws-sdk');

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
  let loged = await ig.account.login(username, password);
  if(!loged) return false;
  const serialized = await ig.state.serialize();
  delete serialized.constants;
  console.log(serialized)
  saveSession(username,serialized)
  return true
}
let ig = null
export default {
  login:async ({username,password})=>{
    ig = new IgApiClient();
    ig.state.generateDevice(username);
    await ig.simulate.preLoginFlow();
    let check = await loadSession(username)
    let loged = false
    if(check){
      console.log(username," exist");
      loged = await ig.state.deserialize(JSON.parse(check));
      console.log(loged)
      if(!loged){
        let a = await login(username,password)
        console.log(a)
      }
    }else{
      console.log(username," login new");
      loged = await login(username,password)
    }
    // let af = await ig.friendship.create('3162844793')
    // console.log(af)
    // if(!user){
    //   return false
    // }
    // user = await Storage.createUser({
    //   object:{
    //     username,
    //     password
    //   },
    //   on_conflict:{
    //     update_columns:['password','username'],
    //     constraint:'clients_username_key'
    //   }
    // })
    // return user
  }
}