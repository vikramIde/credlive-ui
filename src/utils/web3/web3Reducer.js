const initialState = {
  web3Instance: null
}

const web3Reducer = (state = initialState, action) => {
  if (action.type === 'WEB3_INITIALIZED')
  {
    const { web3Instance, web3WsInstance } = action.payload;
    return Object.assign({}, state, {
      web3Instance,
      web3WsInstance
    })
  }

  return state
}

export default web3Reducer
