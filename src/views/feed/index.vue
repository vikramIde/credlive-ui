<template>
  <div class="dashboard-container">
    <div class="vid-category-header" v-if="feed.length>0">
      <i class="el-icon-service"></i>
       
    </div>
    <section  class="vid-category">
        <div class="grid-content" style="">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="Defaulter" name="first">
                  <div v-if="activeName=='first'">
                    <el-col v-for="(defaulter,i) in defaulterList" :key="i" :span="6" style="padding:5px">
                       <el-card class="" >
                        <div slot="header" class="clearfix">

                          <span><el-tag type="danger" v-if="defaulter._source['default.payment.next.month']=='1'">Pay soon</el-tag></span>
                          <el-button style="float: right; padding: 3px 0" @click="openModal(defaulter)">View</el-button>
                        </div>
                        <el-row :gutter="20">
                          <el-col :span="12"><div class="grid-content">Id</div></el-col>
                          <el-col :span="12"><div class="grid-content">{{defaulter._source.ID}}</div></el-col>
                        </el-row>
                        <el-row :gutter="20">
                          <el-col :span="12"><div class="grid-content">Name</div></el-col>
                          <el-col :span="12"><div class="grid-content">{{defaulter._source.Name}}</div></el-col>
                        </el-row>
                        <el-row :gutter="20">
                          <el-col :span="12"><div class="grid-content">Credit Limit</div></el-col>
                          <el-col :span="12"><div class="grid-content">{{defaulter._source.LIMIT_BAL}}</div></el-col>
                        </el-row>
                        <el-row :gutter="20">
                          <el-col :span="12"><div class="grid-content">Recent Bill Amount</div></el-col>
                          <el-col :span="12"><div class="grid-content">{{defaulter._source.BILL_AMT1}}</div></el-col>
                        </el-row>
                      </el-card>
                    </el-col>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="Search" name="second">
                  <sticky v-if="activeName=='second'" class-name="sub-navbar">
                    <div class="time-container">
                     <el-input v-model="searchData" placeholder="Keyword"></el-input>
                    </div>

                    <el-button style="margin-left: 10px;" type="info" @click="getResults">Search
                    </el-button>
                  </sticky>
                  <div v-if="activeName=='second'">
                    <el-col v-for="(defaulter,i) in searchList" :key="i" :span="6" style="padding:5px">
                       <el-card class="" >
                        <div slot="header" class="clearfix">

                           <span><el-tag type="danger" v-if="defaulter._source['default.payment.next.month']=='1'">Pay soon</el-tag></span> 
                           <span><el-tag type="success" v-if="defaulter._source['default.payment.next.month']=='0'">Paid</el-tag></span>
                          <el-button style="float: right; padding: 3px 0" @click="openModal(defaulter)">View</el-button>
                        </div>
                        <el-row :gutter="20">
                          <el-col :span="12"><div class="grid-content">Id</div></el-col>
                          <el-col :span="12"><div class="grid-content">{{defaulter._source.ID}}</div></el-col>
                        </el-row>
                        <el-row :gutter="20">
                          <el-col :span="12"><div class="grid-content">Name</div></el-col>
                          <el-col :span="12"><div class="grid-content">{{defaulter._source.Name}}</div></el-col>
                        </el-row>
                        <el-row :gutter="20">
                          <el-col :span="12"><div class="grid-content">Credit Limit</div></el-col>
                          <el-col :span="12"><div class="grid-content">{{defaulter._source.LIMIT_BAL}}</div></el-col>
                        </el-row>
                        <el-row :gutter="20">
                          <el-col :span="12"><div class="grid-content">Recent Bill Amount</div></el-col>
                          <el-col :span="12"><div class="grid-content">{{defaulter._source.BILL_AMT1}}</div></el-col>
                        </el-row>
                      </el-card>
                    </el-col>
                  </div>
              </el-tab-pane>
            </el-tabs>
            
        </div>
    </section>
    <el-dialog title="Details" :visible.sync="dialogTableVisible">
      <el-tabs v-model="activeNameModal" @tab-click="handleClick">
        <el-tab-pane label="Payments" name="third">
          <el-table :data="billData">
            <el-table-column property="month" label="Month" width="200"></el-table-column>
            <el-table-column property="currency" label="$" width="100"></el-table-column>
            <el-table-column property="value" label="Amt"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="Personal" name="fourth">
            <el-card class=""v-if="activeNameModal=='fourth'" >
              <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content">Id</div></el-col>
                <el-col :span="6"><div class="grid-content">{{defaulter._source.ID}}</div></el-col>
                <el-col :span="6"><div class="grid-content">Name</div></el-col>
                <el-col :span="6"><div class="grid-content">{{defaulter._source.Name}}</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content">Credit Limit</div></el-col>
                <el-col :span="6"><div class="grid-content">{{defaulter._source.LIMIT_BAL}}</div></el-col>
                <el-col :span="6"><div class="grid-content">Recent Bill Amount</div></el-col>
                <el-col :span="6"><div class="grid-content">{{defaulter._source.BILL_AMT1}}</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content">Sex</div></el-col>
                <el-col :span="6"><div class="grid-content">
                  <span v-if="defaulter._source.SEX=='1'">Male</span>
                  <span v-if="defaulter._source.SEX=='2'">Female</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content">Education</div></el-col>
                <el-col :span="6"><div class="grid-content">
                  <span v-if="defaulter._source.EDUCATION=='1'">Graduate school</span>
                  <span v-if="defaulter._source.EDUCATION=='2'">University</span>
                  <span v-if="defaulter._source.EDUCATION=='3'">High school</span>
                  <span v-if="defaulter._source.EDUCATION=='4'">others</span>
                  <span v-if="defaulter._source.EDUCATION=='5'">unknown</span>
                  <span v-if="defaulter._source.EDUCATION=='6'">unknown</span></div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content">Marriage</div></el-col>
                <el-col :span="6"><div class="grid-content">
                  <span v-if="defaulter._source.SEX=='1'">Married</span>
                  <span v-if="defaulter._source.SEX=='2'">Single</span>
                  <span v-if="defaulter._source.SEX=='3'">Others</span>
                </div>
                </el-col>
                <el-col :span="6"><div class="grid-content">Age</div></el-col>
                <el-col :span="6"><div class="grid-content">{{defaulter._source.AGE}}</div></el-col>
              </el-row>
            </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDefaulter ,getUserList} from '@/api/results'
import sticky from '@/components/Sticky'
export default {
  name: 'credit-card',
  components: { sticky },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data(){
    return {

        feed:{},
        searchData:'',
        billData: [],
        defaulter:'',
        activeName: 'first',
        activeNameModal: 'third',
        time: '',
        url: '',
        platforms: ['a-platform'],
        platformsOptions: [
          { key: 'a-platform', name: 'platformA' },
          { key: 'b-platform', name: 'platformB' },
          { key: 'c-platform', name: 'platformC' }
        ],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        dialogTableVisible: false,
        dialogFormVisible: false,
        defaulterList:[],
        searchList:[]
      }
    },
  mounted(){
    console.log(this.$route.name)
    getDefaulter('')
    .then(res=>{
          this.defaulterList = this.parseResponse(res)
      
    })
    .catch(err=>{
      console.log(err)
    })
    // this.getSelectedFeed(this.$route.name)
  },
  methods:{
    openModal(data){
      let arr = []
      this.billData=[]
      for(let i =1; i<7 ; i++){
        let row = {}
        row.value=data._source['BILL_AMT'+i]
        if(i==1)
          row.month='September'
        if(i==2)
            row.month='August'
        if(i==3)
            row.month='July'
        if(i==4)
            row.month='June'
        if(i==5)
            row.month='May'
        if(i==6)
            row.month='April'

          row.currency = 'INR'
          this.billData.push(row)

      }
      this.defaulter = data
      this.dialogTableVisible=true
    },
    handleClick(tab, event) {
        console.log(tab, event);
    },
    parseResponse(res)
    {
      if(res.hits)
        {
          if(res.hits.hits)
            return res.hits.hits
        }
        else
          return []
    },
    getResults(){
      const params = this.searchData
      getUserList(params)
      .then(res=>{
            this.searchList = this.parseResponse(res)
        
      })
    }
  },
  computed :{
   
  }
}
</script>
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
  .grid-content {
    font-size: smaller;
    border-radius: 4px;
    min-height: ;
  }
    .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 300px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }

  .components-container div {
  margin: 10px;
}
.time-container {
  display: inline-block;
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


<style rel="stylesheet/scss" lang="scss" scoped>

</style>
