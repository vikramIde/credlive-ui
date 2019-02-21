import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken,setWeb3 } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    user_img:'',
    avatar: '',
    roles: [],
    usr_details:{},
    web3:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USR_DETAILS: (state, name) => {
      state.usr_details = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_WEB3:(state,data)=>{
      // debugger
      state.web3=data
      console.log(state)
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        debugger
        login(username, userInfo.password)
        .then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    Web3Login({ commit }, recovered) {
      return new Promise((resolve, reject) => {
          try {
            setToken(recovered.toLowerCase())
            // setWeb3(data.web3)
            // commit('SET_TOKEN', toLowerCase())
            resolve(true)
          }
          catch(error) {
            console.error(error);
            resolve(false)
            // expected output: SyntaxError: unterminated string literal
            // Note - error messages will vary depending on browser
          }
          
      })
    },

    //CHienese 
    WEB3_INITIALIZED({ commit }, web3) {
      return new Promise((resolve, reject) => {
          try {
              console.log('I am inside web3Initialized')
              commit('SET_WEB3', web3)
              resolve(true)
          }
          catch(error) {
            console.error(error);
            resolve(false)
            // expected output: SyntaxError: unterminated string literal
            // Note - error messages will vary depending on browser
          }
  
        })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        try{
          // debugger
          commit('SET_TOKEN', state.publicToken)
          commit('SET_USR_DETAILS', state.UserName)
          resolve(true)
        }
        catch(err){
          resolve(false)
        }
          
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        removeToken()
        resolve(true)
        // logout(state.token).then(() => {
        //   // debugger
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   commit('SET_USR_DETAILS', '')
        //   removeToken()
        //   resolve(true)
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
