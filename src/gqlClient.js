import { GraphQLClient } from 'graphql-request'
import 'cross-fetch/polyfill'
const endpoint = process.env.HAUSRA_ENDPOINT
const client = new GraphQLClient(endpoint, {
    headers: {
        'x-hasura-admin-secret': process.env.HAUSRA_KEY,
    }
})

export default {
    createUser: async(args)=>{
        let data = await client.request(`
            mutation insert_user($object:users_insert_input!,$on_conflict:users_on_conflict){
                insert_clients_one(object:$object, on_conflict:$on_conflict){
                    username
                    password
                }
            }
        `,args)
        return data && data.insert_users_one ?data.insert_users_one:false
    }
}