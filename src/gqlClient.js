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
            mutation insert_user($object:clients_insert_input!,$on_conflict:clients_on_conflict){
                insert_clients_one(object:$object, on_conflict:$on_conflict){
                    username
                    password
                    id
                }
            }
        `,args)
        return data && data.insert_clients_one ?data.insert_clients_one:false
    }
}