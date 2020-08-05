import { IgApiClient, IgCheckpointError } from 'instagram-private-api'

import Storage from './gqlClient'

export default {
  login:async ({username,password})=>{
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    let user = await ig.account.login(username, password);
    if(!user){
      return false
    }
    user = await Storage.createUser({
      object:{
        username,
        password
      }
    })
    return user
  }
}