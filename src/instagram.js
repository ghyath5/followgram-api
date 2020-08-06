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
export default {
  login:async ({username,password})=>{
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    await ig.simulate.preLoginFlow();
//     ig.request.end$.subscribe(async () => {
      
//       console.log("===============================================================================================")
//     });
    // await ig.state.deserialize(cookies);
    // await ig.account.login(username, password);
    // const serialized = await ig.state.serialize();
    // delete serialized.constants;
    // console.log(serialized,)
    let a = await loadSession('mahery_soul')
    console.log(JSON.parse(a))
    // saveSession('mahery_soul',serialized)
    //// let a = await ig.friendship.create('3162844793')
    // console.log(a)
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