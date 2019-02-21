<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <div style="padding-bottom : 1px; float:left ; padding-left : 1px;">
          <b>Welcome {{currentUser.userName}} !</b>  
        </div>  
        <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
        <img class="user-avatar" src="https://www.yourfirstpatient.com/assets/default-user-avatar-thumbnail-117c4e02d0bee9a424842ebb2a903cf71468999f79ce30bad99c07f100764064.png">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <!-- <router-link class="inlineBlock"  to=""> -->
          <el-dropdown-item >
            <span @click="goToProfile"> PROFILE</span>
          </el-dropdown-item>
        <!-- </router-link> -->
          <el-dropdown-item>
            {{currentUser.userName}}
          </el-dropdown-item>
          <el-dropdown-item>
            {{currentUser.userEmail}}
          </el-dropdown-item>
        
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">Logout</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { removeToken} from '@/utils/auth'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data(){
    return{
      imageLink:"https://www.yourfirstpatient.com/assets/default-user-avatar-thumbnail-117c4e02d0bee9a424842ebb2a903cf71468999f79ce30bad99c07f100764064.png",
      currentUser :currentUser,
      }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      
      removeToken()
      location.reload()
      //test
      // this.$router.push('/login')
      // this.$store.dispatch('LogOut').then(() => {
      //   console.log('Logout')
      //   location.reload() // 为了重新实例化vue-router对象 避免bug
      // })
    },
    goToProfile(){
      this.$router.push('/profile')

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

