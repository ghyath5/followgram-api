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
    },
    updateUser: async(args)=>{
        
       await client.request(
            `mutation updateUser($where:clients_bool_exp!,$set:clients_set_input){
                update_clients(where:$where,_set:$set){
                    returning{
                        can
                    }
                }
            }`,
            args
        )
    },
    getFollowers:async(username)=>{
        let now = new Date()
        now.setMinutes(now.getMinutes()-1)
        const getFollowersGql = `query users($where:clients_bool_exp){
            clients(where:$where){
                username
                password
                id
            }
        }`
        const followersParams = {
            where:{
                _and:[
                    {username:{_neq:username}},
                    {
                        _not:{
                            following:{
                                client:{
                                    username:{_eq:username}
                                }
                            }
                        }
                    },
                    {
                        _or:[
                            {last_activity  :{_lte:now.toISOString()}},
                            {last_activity :{_is_null:true}}
                        ]
                    }
                ]
            }
        }
        let followers = await client.request(getFollowersGql,followersParams)
        return followers.clients
    },

    deleteUser: async(username)=>{
        await client.request(
            `mutation deleteUser($where:clients_bool_exp!){
                delete_clients(where:$where){
                    affected_rows
                }
            }`,
            {
                where:{
                    username:{_eq:username}
                }
            }
        )
        console.log(username+" deleted")
    }
}