import store from '../store'
// import Web3 from 'web3'

//Metamask validation
export const validateMetaMaskConnections = async function(web3) {
  try{
      if(typeof web3 == 'undefined' || web3 == null || typeof web3.currentProvider.isMetaMask == 'undefined'){
        console.log('Hypersign not installed');  
        return false
      }
      else{
        return true
        //checking conneted to Pramati network or not
        // console.log('checking connected to Pramati network or not...');
        // if(web3.currentProvider.publicConfigStore._state.networkVersion.toString() != "1524990576231") {
        //   console.log('Not connected to Our network');
        //   return false
        // }
      }
    }
    catch(e){
      reject(e)
    }
   
}
//function
export function  CheckAccount(web3){
  return new Promise((resolve,reject) =>{
    //checking if user has unlocked wallet or not
    // debugger
    console.log('checking if user has unlocked wallet or not...');        
    web3.eth.getAccounts((err,accounts)=> {
      if (err != null) console.error("An error occurred: "+err);
      else if (accounts.length == 0){
         reject(true)
      }else {
        resolve(true)
      }
    })
  })
}




export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

