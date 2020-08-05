import { IgApiClient, IgCheckpointError } from 'instagram-private-api'

import Storage from './gqlClient'

export default {
  login:async ({username,password})=>{
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    ig.request.end$.subscribe(async () => {
      const serialized = await ig.state.serialize();
      delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
      console.log(serialized)
      console.log("===============================================================================================")
    });
    let user = await ig.account.login(username, password);
    if(!user){
      return false
    }
    user = await Storage.createUser({
      object:{
        username,
        password
      },
      on_conflict:{
        update_columns:['password','username'],
        constraint:'clients_username_key'
      }
    })
    return user
  }
}