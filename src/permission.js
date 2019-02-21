import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken,getWeb3 } from '@/utils/auth' // 验权
import { validateMetaMaskConnections , CheckAccount } from '@/utils/validate' 

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {

  NProgress.start()

 if(getToken())
  {
	if (to.path === '/login') {
	  next({ path: '/' })
	  NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
	} else {
	  next()
	}
  }
  else{
    if (whiteList.indexOf(to.path) !== -1) {
          next()
        } else {
          next('/login')
          NProgress.done()
        }
    }
  // if(getToken())
  // {
  //     if(validateMetaMaskConnections(store.state.user.web3.web3Instance))
  //     {
  //       CheckAccount(web3)
  //       .then(e=>{
  //         if (to.path === '/login') {
  //             next({ path: '/' })
  //             NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
  //           } else {
  //             next()
  //           }
  //       })
  //       .catch(err=>{
  //         if (whiteList.indexOf(to.path) !== -1) {
  //         next()
  //         } else {
  //         next('/login')
  //         NProgress.done()
  //         }
  //       })
  //     }
  // }
  // else{
  //   if (whiteList.indexOf(to.path) !== -1) {
  //         next()
  //       } else {
  //         next('/login')
  //         NProgress.done()
  //       }
  //   }


})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
