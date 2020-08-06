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
let ig = null
export default {
  login:async ({username,password})=>{
    ig = new IgApiClient();
    ig.state.generateDevice(username);
    await ig.simulate.preLoginFlow();
    let check = await loadSession(username)
    if(check){
      console.log(username," exist");
      await ig.state.deserialize(JSON.parse(check));
    }else{
      console.log(username," login new");
      await ig.account.login(username, password);
      const serialized = await ig.state.serialize();
      delete serialized.constants;
      saveSession(username,serialized)
    }
    console.log("asdf",f)
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