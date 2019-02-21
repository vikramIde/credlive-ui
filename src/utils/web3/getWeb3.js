import store from '../../store'
import Web3 from 'web3'
import HyperSignProvider from '../../hypersign-sdk'
const {RPC_PROD, RPC_DEV} =  require('../../../config/bcConfig')

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED'
const WEB_SOCKET_ADDR = "ws://172.17.2.166:8546";

let getWeb3 = new Promise(function(resolve, reject) {
  window.addEventListener('load', async function(dispatch) {
    // debugger
    var results
    var web3 = window.web3
    var provider = new HyperSignProvider(RPC_DEV)
    // var provider = new HyperSignProvider('https://ropsten.infura.io/') 
    web3 = new Web3(provider)  
    results = {
              web3Instance: web3
              //web3WsInstance: web3Ws
            } 
    store.dispatch('WEB3_INITIALIZED',results).then(res => { // 拉取用户信息
      resolve(true)
    }).catch((e) => {
      resolve(false)
    })
  });
});

// let getWeb3 = new Promise(function(resolve, reject) {
//   // Wait for loading completion to avoid race conditions with web3 injection timing.
//   window.addEventListener('load', async function(dispatch) {
//     var results
//     var web3 = window.web3
//     debugger

//     var provider = new HyperSignProvider('http://127.0.0.1:8545')
    
//     web3 = new Web3(provider)    


//     // Checking if Web3 has been injected by the browser (Mist/MetaMask)
//     if (web3) {
//       // Use Mist/MetaMask's provider.
//       web3 = new Web3(web3.currentProvider)
//       //const web3Ws = new Web3(WEB_SOCKET_ADDR);

//       results = {
//         web3Instance: web3
//         //web3WsInstance: web3Ws
//       }

      
//       // let res = await store.dispatch('WEB3_INITIALIZED',results);
//       // resolve(true);
//       // debugger
//       store.dispatch('WEB3_INITIALIZED',results).then(res => { // 拉取用户信息
//         resolve(true)
//       }).catch((e) => {
//         resolve(false)
//       })
//     } else {

//       // Fallback to localhost if no web3 injection. We've configured this to
//       // use the development console's port by default.
//       var provider = new Web3.providers.HttpProvider('http://localhost:8545')

//       web3 = new Web3(provider)

//       results = {
//         web3Instance: web3
//       }

//       console.log('No web3 instance injected, using Local web3.');
//       store.dispatch('WEB3_INITIALIZED',results).then(res => { // 拉取用户信息
//         console.log('Injected web3 detected.');
//         resolve(true)
//       }).catch(() => {
//         console.log('Web3 present in windows but error in dispatcing to STORE.')
//         resolve(false)
//       })
//     }
//   })
// })

export default getWeb3
