import axios from 'axios'
// Initiation 
 let config ={
              "data": {
                "attributes": {
                  appId: 21,
                  publicToken: "publicKey",
                  encryptedRawTx: "rawTx",
                  txDigest : "", // this will will be filled after tx signing in mobile app
                  txHash : "", // this will be filled once transaction is successfully broadcasted in network
                  txStatus : "Pending" //initially status will be in pending 
                }
              }
            }

let urlToStoreTx='https://obscure-woodland-78571.herokuapp.com/addTx'
let urlToGetTx='https://obscure-woodland-78571.herokuapp.com/getTx'

class HSController{

  addNewTransaction = (appId, publicKey, rawTx)=> {
      try{
        return new Promise((resolve) => {
             try{
                  config.data.attributes.appId= appId
                  config.data.attributes.publicToken= publicKey
                  config.data.attributes.encryptedRawTx= rawTx

                 axios.post(urlToStoreTx,config)
                  .then(e=>{
                    resolve(e.data.data[0].attributes.data._id)
                  })
                  .catch(er=>{
                    console.error(er)
                    resolve(false)
                  })
             }
             catch(err){
              console.error('Error in collection call',err)
              resolve(false)
              
             }
            

        });
      }
      catch(eee){
        console.log("Promise Error adding document: ",eee)
      }
      
  }
  getTransaction = (_id)=> {
      try{
          return new Promise((resolve) => {
               try{
                    config.data.attributes.id= _id

                   axios.post(urlToGetTx,config)
                    .then(e=>{
                      resolve(e)
                    })
                    .catch(er=>{
                      console.error(er)
                      resolve(false)
                    })
               }
               catch(err){
                console.error('Error in collection call',err)
                resolve(false)
               }
          });
      }
      catch(eee){
        console.log("Promise Error adding document: ",eee)
      }
  }

}
const instance = new HSController()
// Object.freeze(instance);

export default instance