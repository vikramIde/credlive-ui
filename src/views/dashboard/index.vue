<template>
  <div class="dashboard-container">
    <section v-for="feed in feeds" class="vid-category">
        <div class="vid-category-header"><i class="el-icon-service"></i>{{feed.category.topic}} - <span class="time">{{feed.category.subtopic}}</span></div>
          <div class="grid-content">
            <el-row class="card_box_main" :gutter="30" >
              <el-col v-for="(video, index) in feed.video_list" :md="4" :key="index" class="card_box">
                <el-card style="padding:0px" shadow="hover" >
                  <img :src="video.thumb_nail" class="image" style="width:100%;">
                  <div style="padding: 5px;">
                    <span>{{video.title}}</span>
                    <div class="bottom clearfix">
                      <time class="time">{{ video.timeStamp }}</time>
                      <el-button type="text" class="button" @click="gotoFeed(feed.category.router)">View</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <!-- <loading :show="loaderShow" :label="loaderLabel"></loading> -->
    </section>
  </div>
</template>
<style>
  .card_box_main{
    overflow-x: auto;
    white-space: nowrap;
  }
  .card_box{
    display: inline-block;
    float: none;
  }
  .vid-category{
    padding: 14px;
  }
  .vid-category-header{
    color: #333;
    line-height: 60px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
   .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
<script>
import { mapGetters } from 'vuex'
import TestAbi from '../../../build/contracts/TestContract.json';
import contract from  'truffle-contract';
import loading from 'vue-full-loading'

export default {
  name: 'dashboard',
  components: {
    loading
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {
    //debugger
    let web3 =  this.$store.state.user.web3.web3Instance
    
    if(web3){
      //debugger
      this.loaderShow = true
      const testContract = contract(TestAbi)
      testContract.setProvider(web3.currentProvider);
      testContract.deployed().then(testContractInstance => {
        testContractInstance.getAllMediaIds().then((result)=>{
          //debugger
          if(result && result[0] && result[1]){
            if(result[1] > 0){
              const mediaIds = result[0]
              if(mediaIds){
                const ipfsHashes = mediaIds.split('|')
                if(ipfsHashes && ipfsHashes.length > 0){
                  let videoList = []
                  ipfsHashes.forEach((element, index) => {
                    let videoObj = {
                      title : 'Title' + index,
                      url : 'https://ipfs.io/ipfs/' + element,
                      description : 'Some random description',                      
                      thumb_nail : 'https://ipfs.io/ipfs/' + element,
                      views:"4 million",
                      timeStamp:"last month"
                    } 
                    videoList.push(videoObj)
                    console.log(videoObj)
                    if(index == ipfsHashes.length -1){
                    }
                  });
                  this.feeds[0].video_list = videoList && videoList.length > 0 ?videoList  :this.feeds[0].video_list                  
                  this.loaderShow = false
                }else{
                  console.log("Inside else of ipfsHashes && ipfsHashes.length > 0")
                  this.loaderShow = false
                }
              }else{
                console.log("Inside else of mediaIds")
                this.loaderShow = false
              }
            }else{
              console.log("Inside else of result[1] > 0")
              this.loaderShow = false
            }
          }else{
            console.log("Inside else of result && result[0] && result[1]")
            this.loaderShow = false
          }
          console.log(result)
        })
        .catch((err)=>{
          console.log("Error : " + err.message);
          this.loaderShow = false;
        })
      })
    }else{
      alert('Error : ' + GENERAL.NOWEB3 + '. Please login again.')
      console.log(GENERAL.NOWEB3)
    }
  },
  methods:{
    gotoFeed(topic){
     let newTopic = '/feed/'+topic.toLowerCase()
     console.log(newTopic)
     
      this.$router.push(newTopic)
    },
    getAllHashes() {
      
    },
  },
  data(){
    return {
      feeds:[
        { category:
          {topic:"Trending",subtopic:"",router:'Trending'},
          video_list:[
            {
              title:"Title 3",
              url:"https://ipfs.io/ipfs/QmQc8ijGUrdYDVLG8KJmHwezXLGshWg1uxnKZ5xFAbJNqz",
              description:"Hi I am the description og the video",
              thumb_nail:"https://ipfs.io/ipfs/QmQc8ijGUrdYDVLG8KJmHwezXLGshWg1uxnKZ5xFAbJNqz",
              views:"4 million",
              timeStamp:"last month"
            },
            {
              title:"Title 2",
              url:"https://ipfs.io/ipfs/QmQc8ijGUrdYDVLG8KJmHwezXLGshWg1uxnKZ5xFAbJNqz",
              description:"Hi I am the description og the video",
              thumb_nail:"https://ipfs.io/ipfs/QmQc8ijGUrdYDVLG8KJmHwezXLGshWg1uxnKZ5xFAbJNqz",
              views:"4 million",
              timeStamp:"last month"
            },
            {
              title:"Title 3",
              url:"https://ipfs.io/ipfs/QmQc8ijGUrdYDVLG8KJmHwezXLGshWg1uxnKZ5xFAbJNqz",
              description:"Hi I am the description og the video",
              thumb_nail:"https://ipfs.io/ipfs/QmQc8ijGUrdYDVLG8KJmHwezXLGshWg1uxnKZ5xFAbJNqz",
              views:"4 million",
              timeStamp:"last month"
            },{
              title:"Title 5",
              url:"https://ipfs.io/ipfs/QmQc8ijGUrdYDVLG8KJmHwezXLGshWg1uxnKZ5xFAbJNqz",
              description:"Hi I am the description og the video",
              thumb_nail:"https://ipfs.io/ipfs/QmQc8ijGUrdYDVLG8KJmHwezXLGshWg1uxnKZ5xFAbJNqz",
              views:"4 million",
              timeStamp:"last month"
            },
          ]
        },
      ],
      loaderShow: false,
      loaderLabel: 'Fetching from blockchain...'
    } 
  }
  
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
