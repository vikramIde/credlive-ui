<template>
<div>
    <div>
      <vue-particles
        color="#dedede"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="4"
        linesColor="#dedede"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
      <div class="login-container">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
          class="card-box login-form">
          <h3 class="title">Welcome to Adhat!</h3>
          <el-form-item style="background : white">
            <qrcode-vue :value="value" :size="310" level="H" ></qrcode-vue>
          </el-form-item>
        </el-form>
        
      </div>
    </div>
  </div>
</template>
<style>
.primary {
    padding: 8px 12px;
    background: #F7861C;
    box-shadow: 0px 3px 6px rgba(247, 134, 28, 0.36);
    color: white;
    font-size: 1.1em;
    font-family: 'Montserrat Regular';
    text-transform: uppercase;
}
#particles-js{ position:absolute; width: 100%; height: 100%; background-color: #b61924; background-image: url(""); background-repeat: no-repeat; background-size: cover; background-position: 50% 50%; }
</style>
<script>

import { isvalidUsername } from '@/utils/validate'
import { validateMetaMaskConnections , CheckAccount} from '@/utils/validate'
import QrcodeVue from 'qrcode.vue' 
var ethUtil = require('ethereumjs-util')
var sigUtil = require('eth-sig-util')
import  getWeb3  from '@/utils/web3/getWeb3' // 验权
import {authservice} from '../../mixins/pusherlogin.js'
import HSController from '../../hypersign-sdk/controllers/hsi-controller.js'
import { getToken,setToken } from '@/utils/auth' // 验权


// import  CryptoJS from 'crypto-js'
var CryptoJS = require("crypto-js");

getWeb3
  .then(results => {
    console.log('Web3 initialize in store')
  })
  .catch((err) => {
    console.log('Error in web3 initialization. Err = '+ err)
  })

export default {
  components: {
    QrcodeVue
  },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      value: '{"id": 21,"direction":"Login"}',
      size: 300,
      showQR : false,
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  mixins:[authservice],
  methods: {
    Testfirebase(){
      let promise = HSController.getTransaction('5b80708141dd4600147c6e88')
      promise
      .then((id)=>{
          // this.value = id
          console.log(id)
          // this.showQR = true
      })
      .catch((err)=>{
        console.log('Something wrong in tx')
      })
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin_() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleLogin(tokenMessage) {
      console.log(tokenMessage)

      if(tokenMessage){
        localStorage.setItem("currentUser",JSON.stringify(tokenMessage));
      }
      window.currentUser =  tokenMessage.currentUser

      this.$store.dispatch('SetInfo',tokenMessage.currentUser)
      .then(e=>{
        setToken(tokenMessage.currentUser.publicToken)
        this.$router.push({ path: '/dashboard' });
      })
      .catch(err=>{
        console.log(err)
      })
      
      // let web3 =  this.$store.state.user.web3.web3Instance
      // // Double-check web3's status.
      // if (typeof web3 !== 'undefined' || web3 !='') {
      //   console.log(web3)
      //   if(validateMetaMaskConnections(web3)){ 
      //         CheckAccount(web3)
      //         .then(e=>{
      //             web3.eth.getAccounts((err,newres)=>{
      //               var from = newres[0];
      //               var text = "These are the terms and conditions!"
      //               var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
      //               // var msg = '0x1' // hexEncode(text)
      //               console.log(msg)
      //               console.log('CLICKED, SENDING PERSONAL SIGN REQ')
      //               var params = [msg, from]
      //               var method = 'personal_sign'

      //               web3.currentProvider.sendAsync({
      //               method,
      //               params,
      //               from,
      //               }, (err, result) => {
      //                 if (err) return console.error(err)
      //                 if (result.error) return console.error(result.error)
      //                 console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

      //                 console.log('recovering...')
      //                 const msgParams = { data: msg }
      //                 msgParams.sig = result.result
      //                 console.dir({ msgParams })
      //                 const recovered = sigUtil.recoverPersonalSignature(msgParams)
      //                 console.dir({ recovered })

      //                 if (recovered.toLowerCase() === from.toLowerCase()) {
      //                   console.log('SigUtil Successfully verified signer as ' + from)
      //                     this.$store.dispatch('Web3Login',recovered).then(() => {
      //                     this.loading = false
      //                     this.$router.push({ path: '/' })
      //                   }).catch(() => {
      //                     this.loading = false
      //                   })
      //                 } else {

      //                   this.loading = false
      //                   console.dir(recovered)
      //                   console.log('SigUtil Failed to verify signer when comparing ' + recovered.result + ' to ' + from)
      //                   console.log('Failed, comparing %s to %s', recovered, from)
      //                 }
      //             })
      //           });
      //         })
      //         .catch(er=>{
      //           alert('Login to your Metamask ')
      //         })
              
      //   }
      //   else{alert('Please install Metanask plugin')}

      // } else {
      //   console.error('Web3 is not initialized.');
      // }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:rgba(45, 58, 75, 0.4);
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    position: fixed;
    height: 100%;
    width:100%;
    background-color: $bg;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
</style>
