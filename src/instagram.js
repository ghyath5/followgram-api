import { IgApiClient, IgCheckpointError } from 'instagram-private-api'
import Storage from './gqlClient'

export default {
  login:async ({username,password})=>{
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    await ig.simulate.preLoginFlow();
//     ig.request.end$.subscribe(async () => {
      
//       console.log("===============================================================================================")
//     });
    let cookies = `{ cookies: '{"version":"tough-cookie@2.5.0","storeType":"MemoryCookieStore","rejectPublicSuffixes":true,"cookies":[{"key":"csrftoken","value":"eqzyRhAi3CqQNwkS7mfhaXvryJ54XoKC","expires":"2021-08-05T19:10:14.000Z","maxAge":31449600,"domain":"instagram.com","path":"/","secure":true,"hostOnly":false,"creation":"2020-08-06T19:10:12.794Z","lastAccessed":"2020-08-06T19:10:14.944Z"},{"key":"rur","value":"ASH","domain":"instagram.com","path":"/","secure":true,"httpOnly":true,"hostOnly":false,"creation":"2020-08-06T19:10:12.797Z","lastAccessed":"2020-08-06T19:10:14.946Z"},{"key":"mid","value":"XyxVlAABAAGMCbmVZBJrYQsMkKcT","expires":"2030-08-04T19:10:12.000Z","maxAge":315360000,"domain":"instagram.com","path":"/","secure":true,"hostOnly":false,"creation":"2020-08-06T19:10:12.799Z","lastAccessed":"2020-08-06T19:10:13.328Z"},{"key":"ds_user","value":"mahery_soul","expires":"2020-11-04T19:10:14.000Z","maxAge":7776000,"domain":"instagram.com","path":"/","secure":true,"httpOnly":true,"hostOnly":false,"creation":"2020-08-06T19:10:14.942Z","lastAccessed":"2020-08-06T19:10:14.942Z"},{"key":"ds_user_id","value":"17327308117","expires":"2020-11-04T19:10:14.000Z","maxAge":7776000,"domain":"instagram.com","path":"/","secure":true,"hostOnly":false,"creation":"2020-08-06T19:10:14.951Z","lastAccessed":"2020-08-06T19:10:14.951Z"},{"key":"sessionid","value":"17327308117%3AhJ7NYtiNNKlOgt%3A20","expires":"2021-08-06T19:10:14.000Z","maxAge":31536000,"domain":"instagram.com","path":"/","secure":true,"httpOnly":true,"hostOnly":false,"creation":"2020-08-06T19:10:14.953Z","lastAccessed":"2020-08-06T19:10:14.953Z"}]}', supportedCapabilities: [ { name: 'SUPPORTED_SDK_VERSIONS', value: '13.0,14.0,15.0,16.0,17.0,18.0,19.0,20.0,21.0,22.0,23.0,24.0,25.0,26.0,27.0,28.0,29.0,30.0,31.0,32.0,33.0,34.0,35.0,36.0,37.0,38.0,39.0,40.0,41.0,42.0,43.0,44.0,45.0,46.0,47.0,48.0,49.0,50.0,51.0,52.0,53.0,54.0,55.0,56.0,57.0,58.0,59.0,60.0,61.0,62.0,63.0,64.0,65.0,66.0' }, { name: 'FACE_TRACKER_VERSION', value: 12 }, { name: 'segmentation', value: 'segmentation_enabled' }, { name: 'COMPRESSION', value: 'ETC2_COMPRESSION' }, { name: 'world_tracker', value: 'world_tracker_enabled' }, { name: 'gyroscope', value: 'gyroscope_enabled' } ], language: 'en_US', timezoneOffset: '0', radioType: 'wifi-none', capabilitiesHeader: '3brTvwE=', connectionTypeHeader: 'WIFI', isLayoutRTL: false, euDCEnabled: undefined, adsOptOut: false, thumbnailCacheBustingValue: 1000, clientSessionIdLifetime: 1200000, pigeonSessionIdLifetime: 1200000, deviceString: '26/8.0.0; 480dpi; 1080x2076; samsung; SM-G950F; dreamlte; samsungexynos8895', deviceId: 'android-f861fae11223bd9f', uuid: 'b2feab1c-75d3-5909-be6e-eb2d53f32993', phoneId: '23ad2bee-e8cf-53cc-b3f0-7dc90cde7912', adid: '6577ec02-9a95-56d8-9f64-22e7cdb9682d', build: 'NMF26X', igWWWClaim: 'hmac.AR239A_BDM8dY4zW3MGot1WJ6lHXFNgNlbChpMQivFRM1g1i', passwordEncryptionKeyId: '109', passwordEncryptionPubKey: 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUE2MnhlMWo3cTdTZEdlOUhKQ1JQbwpBdVM5bmcrSFBIV0VVZmlqVlBRRkxLeElGYjVVQWExZmdOdjdyVWIxWEZrYlFXYWdxNm1ramlJTXorRytSTkxmClUzTjJYak9qbDRKc2oyWVRDaTRxUXZPSldIUHVXTjg5UWd0VThlZnNMUjk4bFNoT3NwenorVjdMSXM4RXlFa3IKd05ROXdkTGVSK2t3eitwU3hNdWxtTVE4MjB2WE1CUld3ZnllQVN2eGx4YWxuM3lXTllFUUlBY1AxdXFQZFR0TQprKzNTdWRhcjJRZFBwU0tHQ1YzMFQ0N1FuUURNQUxMTFo3QURBbUs3dEdWN29ydHhnZGMxTnk5bUhzejZhWWM1ClhIU0JGRDlLbzM4clpWdUVmVnVvWktZeERWQVdlWGJCMFpQaXNzTElhMGxUYjRtTDQ5SEZ3RzVxcXZiTDFhM3AKTXdJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==' }`
    await ig.state.deserialize(cookies);
    // await ig.account.login(username, password);
    const serialized = await ig.state.serialize();
    delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
    console.log(serialized)
    let a = await ig.friendship.create('3162844793')
    console.log(a)
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