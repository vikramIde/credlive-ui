<template>
  <div class="">
     
          <div>
            <ul>
              <li id="ipfs" class="started"> {{UPLOAD.UPLD_IPFS_ONGO}} </li>
            </ul>
           <ul>
              <li id="bc" class="not-started"> {{UPLOAD.UPLD_BC_ONGO}} </li>
           </ul> 
           <qrcode-vue :value="value" :size="310" level="H" v-if = "showQR"></qrcode-vue>
           <ul>
              <li id="bcm" class="not-started"> {{UPLOAD.UPLD_BC_MINED}} </li>
           </ul> <!-- {{ validationMessage }} -->
          </div>
          <div class="dialog-footer">
            <pulse-loader :loading="loading" :color="color" :size="size" v-if="showLoader"></pulse-loader>
            <!-- <scale-loader :loading="loading" :color="color" :height="height" :width="width" v-if="showLoader"></scale-loader> -->
            <!-- <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false">Confirm</el-button> -->
          </div>
  </div>
</template>

<script>
import {UPLOAD, GENERAL} from '../../utils/message'
import HSDispatcher from '../../hypersign-sdk/dispatcher/dispatcher.js'
import HSController from '../../hypersign-sdk/controllers/hsi-controller.js'
import QrcodeVue from 'qrcode.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

var CryptoJS = require("crypto-js");

export default {
  components: {
    QrcodeVue,
    PulseLoader
  },
  mounted() {
    let promise = HSDispatcher.QREventListener()
    promise.then((rawTx) => {
      this.makeTransaction(rawTx)
    }).catch((err) => { 
      console.log('Error : Error in mounted in login' + err)
    })
  },
  data() {
    return {
      value: '{"id": 21,"direction":"Login"}',
      showQR: false,
      showLoader : true,
      dialog: true,
      dialogVisible: false,
      UPLOAD : UPLOAD,
      appId:21,
      validationMessage : UPLOAD.UPLD_IPFS_ONGO
    }
  },
  methods: {//
    makeTransaction(rawTx){
      let msg = JSON.stringify({"id": this.appId,"direction":"registration", "rawTx" : rawTx})
      let encmsg = CryptoJS.AES.encrypt(msg, 'secret key 123').toString()
      let promise = HSController.addNewTransaction(this.appId, "publicKey", encmsg)
      promise
      .then((id)=>{
          this.value = id
          console.log(this.value)
          this.showQR = true
      })
      .catch((err)=>{
        console.log('Something wrong in tx')
      })

    }
  }
}
</script>

<style scoped lang="scss">
.line{
  text-align: center;
}
.content-upload-form{
  padding:10px;
}


.not-started {
  padding: 5px;
  font-size: x-large;
  color: gray
}

.started {
  padding: 5px;
  font-size: x-large;
  color:black
}
.success {
  padding: 5px;
  font-size: x-large;
  color : green
}
</style>

