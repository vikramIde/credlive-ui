<template>
  <div class="dashboard-container">
     <section class="content-upload-form">
        <!-- <el-button type="success" @click="dialogVisible = true">open the Dialog</el-button> -->
        <el-dialog :title="titleData" :visible.sync="dialogVisible" width="30%">          
          <Signtx></Signtx>
        </el-dialog>

        <el-form ref="form" :model="form" style="margin: 20px; width: 60%; min-width: 600px;" label-width="120px">
          <el-form-item label="Title">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="Tags">
            <el-select v-model="form.tag" placeholder="please select your tag">
              <el-option label="Image" value="image"></el-option>
              <el-option label="Music" value="music"></el-option>
              <el-option label="File" value="file"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Sub-Tags">
            <el-select v-model="form.subtag" placeholder="please select sub tag">
              <el-option label="Bhangra" value="bhangra"></el-option>
              <el-option label="Bhojpuri" value="bhojpuri"></el-option>
              <el-option label="Rocknroll" value="rocknroll"></el-option>
              <el-option label="Blus/jazz" value="blus_jazz"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-upload
              class="upload-demo"
              drag
              action=""
              :on-preview="handlePreview"
              :auto-upload="false"
              :on-remove="deleteAttachment"
              :file-list="form.fileList"
              :on-change="addAttachment"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
              <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
            </el-upload>
                        
          </el-form-item>
          <el-form-item label="Description">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit()">Create</el-button>
            <el-button @click="onCancel">Cancel</el-button>
          </el-form-item>
        </el-form>
    </section> 
  </div>
</template>



<script>
import  getWeb3  from '@/utils/web3/getWeb3' 
import {authservice} from '../../mixins/pusherlogin.js'
import {uploadFile} from '../../utils/utils';
import {UPLOAD, GENERAL} from '../../utils/message';
import contract from  'truffle-contract';
import TestAbi from '../../../build/contracts/TestContract.json';
import MediaStoreAbi from '../../../build/contracts/MediaStore.json'
import QrcodeVue from 'qrcode.vue'
var CryptoJS = require("crypto-js");
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import Signtx from '../../components/signtx/index.vue'
import {signtxMixin} from '../../mixins/signtx.js'

export default {
  components: {
    QrcodeVue,
    PulseLoader,
    ScaleLoader,
    Signtx
  },
  mixins:[signtxMixin],
  mounted() {
  },
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        fileList : []
      },
      value: '{"id": 21,"direction":"Login"}',
      showQR: false,
      showLoader : false,
      dialog: true,
      titleData:"Transaction Module",
      dialogVisible: false,
      UPLOAD : UPLOAD,
      validationMessage : UPLOAD.UPLD_IPFS_ONGO,
      publicKey : (window.currentUser? window.currentUser.publicToken : '0x1e36d26ec23657041b6dfc5b52a640192ccc4ef8')
    }
  },
  methods: {
    showHideDialog(cond) {
      return new Promise((resolve, reject)=>{
        this.showLoader = cond
        this.dialogVisible = cond
        resolve()
      })
    },
    onSubmit() {
      // this.getAllHashes();
      // return
      const file =  this.form.fileList[0]
      if(file && file.raw){
        this.showHideDialog(true).then(()=>{
          uploadFile(file.raw).then((result, filehash)=>{
            if(result && result.res){
              const filehash = result.hash
              this.updateStatus('ipfs', "COMPLETED")
              setTimeout((fileHash)=>{
                console.log('https://ipfs.io/ipfs/' + filehash)
                // uplaod the content to blockchain
                this.callSendTx(filehash, 'Title')
              }, 1000)
            }else{
              // upload unsuccessfull
              this.$message(UPLOAD.UPLD_IPFS_FAIL)
              this.showLoader = false
              this.dialogVisible = false
            }
            //hide loader
          })
          .catch((err)=>{
            this.showLoader = false
            this.dialogVisible = false
            //hide loader 
            // print err
          })
        })       
      }
    },
    addAttachment ( file, fileList ) {
          this.form.fileList.push( file );
    },
    deleteAttachment () {
          // removes from array
    },
    handlePreview (){
      //
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    callSendTx(fileHash, fileTitle) {
      this.updateStatus('bc', "STARTED")
      let web3 =  this.$store.state.user.web3.web3Instance
      if(web3){
        const testContract = contract(TestAbi)
        testContract.setProvider(web3.currentProvider);
        testContract.deployed()
        .then((instance) => {
          const publicKey = window.currentUser? window.currentUser.publicToken : '0x1e36d26ec23657041b6dfc5b52a640192ccc4ef8'
          instance.addMedia(
            fileHash,
            'Title',
            { from: publicKey }
          ).then((txHash)=>{
            debugger
            this.updateStatus('bcm', "STARTED")
            let poll = setInterval(function(){ 
              web3.eth.getTransactionReceipt(txHash.tx, function(e, receipt) {
                debugger
                console.log('Waiting for transaction confirmation....')
                if(receipt != null){
                  console.log('Transaction confirmed.')
                  const message = " ****** Transaction Receipt ****** \n Tx Hash : \n -------------- \n"+receipt.transactionHash +" \n BlockHash :  \n -------------- \n"+receipt.blockHash+" \n BlockNumber :  \n -------------- \n"+receipt.blockNumber+" \n GasUsed :  \n -------------- \n"+receipt.gasUsed+" \n "
                  alert(message)
                  this.showLoader = false
                  clearInterval(poll)
                }
              })
            }, 3000);
              this.updateStatus('bc', "COMPLETED")
              this.showQR = false
              alert('Transaction sucessfull : txHash : '+ txHash.tx)
          })
        })
      }else{
        const message = GENERAL.NOWEB3 + " : " + 'Please login again' 
        alert(message)
        this.showLoader = false
      }
    },

    

    // sendToBC (files, metadata)  {
    //   return new Promise((resolve, reject) => {
    //       const web3 = store.getState().web3.web3Instance;
    //       if (!web3) reject(new Error("Unable to insrtantiate web3"));
    //       // Get current ethereum wallet.
    //       web3.eth.getCoinbase((error, coinbase) => {
    //           if (error) reject(new Error("Unable to getaccount details"));
    //           onAccountRetrieved(error, coinbase, web3, files, metadata)
    //           .then(resolve)
    //       })
    //   })
    // },

    // onAccountRetrieved (error, coinbase, web3, files, metadata) {
    //   const mediaStoreContract = contract(MediaStoreAbi);
    //   mediaStoreContract.setProvider(web3.currentProvider);
    //   let mediaId = files[0].hash;;
      
    //   return mediaStoreContract.deployed()
    //   .then(mediaStoreInstance => {
    //       return mediaStoreInstance.addMedia(
    //           mediaId,
    //           'hardCodedTag',
    //           { from: coinbase }
    //       )
    //   }).then(({ receipt: { to, transactionHash }}) => {
    //       alert('Content successfully added into blockchain. transactionHash : ' + transactionHash)
    //   });
    // }

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

