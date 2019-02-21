<template>
  <div class="dashboard-container">
    <div class="vid-category-header" v-if="feed.length>0">
      <i class="el-icon-service"></i>
        {{feed.category.topic}} - <span class="time">{{feed.category.subtopic}}</span>
    </div>
    <section v-for="video in feed.video_list" class="vid-category">
        <div class="grid-content" style="">
          <el-container>
            <el-aside width="">
              <el-card style="padding:0px" shadow="hover" >
                 <img :src="video.thumb_nail" class="image" style="max-height:200px;max-width:200px">

              </el-card>
               <el-button type="primary" >Buy</el-button>
            </el-aside>
            <el-container>
              <el-header>{{video.title}}</el-header>
              <el-main>{{video.description}}</el-main>
              <el-footer>
                <time class="time">{{ video.timeStamp }}</time>
                <time class="time">{{ video.views }}</time>
              </el-footer>
            </el-container>
          </el-container>
          <!-- <el-container>
            <el-aside>
              
            </el-aside>
            <el-main>
              <div style="">
                <div class="vid-category-header"><i class="el-icon-service"></i>{{video.title}}</div>
                <div class="bottom clearfix">
                  <time class="time">{{ video.timeStamp }}</time>
                  <time class="time">{{ video.views }}</time>
                </div>
              </div>
            </el-main>
          </el-container> -->
        </div>
    </section>
  </div>
</template>
<style>
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
  /*.el-col {
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
  }*/
  .row-bg {
    padding: 10px 0;
    /*background-color: #f9fafc;*/
  }
 /* .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }*/
  
/*  .el-aside {
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
  }*/
  
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
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {
    debugger
    let web3 =  this.$store.state.user.web3.web3Instance
    if(web3){
      const testContract = contract(TestAbi)
      testContract.setProvider(web3.currentProvider);
      testContract.deployed().then(testContractInstance => {
        testContractInstance.getAllMediaIds(
          { from: '' }
        ).then((result)=>{
          debugger
          if(result && result[0] && result[1]){
            if(result[1] > 0){0x1e36d26ec23657041b6dfc5b52a640192ccc4ef8
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
                }else{
                  console.log("Inside else of ipfsHashes && ipfsHashes.length > 0")
                }
              }else{
                console.log("Inside else of mediaIds")
              }
            }else{
              console.log("Inside else of result[1] > 0")
            }
          }else{
            console.log("Inside else of result && result[0] && result[1]")
          }
          console.log(result)
        })
      })
    }else{
      console.log(GENERAL.NOWEB3)
    }
  },
  data(){
    return {
        feed:{},
        feeds:[{ category:{topic:"Trending",subtopic:""},
                video_list:[
                   {
                    title:"Title 3",
                    url:"https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG",
                    description:"Hi I am the description og the video",
                    thumb_nail:"http://www.artifilmsmp3.com/wp-content/uploads/2016/01/2-Pooja-Ke-Thali-leke-470x470.jpg",
                    views:"4 million",
                    timeStamp:"last month"
                  },
                  {
                    title:"Title 2",
                    url:"https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG",
                    description:"Hi I am the description og the video",
                    thumb_nail:"https://i.ytimg.com/vi/6Z0knzjibm8/maxresdefault.jpg",
                    views:"4 million",
                    timeStamp:"last month"
                  },
                 {
                    title:"Title 3",
                    url:"https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG",
                    description:"Hi I am the description og the video",
                    thumb_nail:"https://www.learnjazzstandards.com/wp-content/uploads/2015/09/JohnColtrane-2.jpg",
                    views:"4 million",
                    timeStamp:"last month"
                  },{
                    title:"Title 5",
                    url:"https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG",
                    description:"Hi I am the description og the video",
                    thumb_nail:"https://4.bp.blogspot.com/-MpV20i_QWkY/V5ZDxVr9NKI/AAAAAAAAGn4/i-qnybntX78zsEWvWLtek9ytuZZ-Gyf2QCLcB/s640/kanwatr-ke-power-dinesh-lal-yadav-amarpali-dunbey.jpg",
                    views:"4 million",
                    timeStamp:"last month"
                  },
                  {
                    title:"Title 3",
                    url:"https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG",
                    description:"Hi I am the description og the video",
                    thumb_nail:"https://www.learnjazzstandards.com/wp-content/uploads/2015/09/JohnColtrane-2.jpg",
                    views:"4 million",
                    timeStamp:"last month"
                  },
                  {
                    title:"Title 7",
                    url:"https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG",
                    description:"Hi I am the description og the video",
                    thumb_nail:"https://i.ytimg.com/vi/_I6r7VL2XMo/maxresdefault.jpg",
                    views:"4 million",
                    timeStamp:"last month"
                  },
                  {
                    title:"Title 8",
                    url:"https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG",
                    description:"Hi I am the description og the video",
                    thumb_nail:"https://i.ytimg.com/vi/_I6r7VL2XMo/maxresdefault.jpg",
                    views:"4 million",
                    timeStamp:"last month"
                  }
              ],
      }
      ]
      
    }

  },
  mounted(){
    console.log(this.$route.name)
    this.getSelectedFeed(this.$route.name)
  },
  methods:{
    getSelectedFeed(url){
       var x =  this.feeds.filter(feed=>{
            return feed.category.topic == url
       })
       this.feed=x[0]
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
