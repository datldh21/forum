const initState = {
  user: null
};

const HeaderInfo = (state = initState, action) => {
  switch (action.type) {
    case 'SET_HEADER_INFO':
      return {...state.user, user: action.data};
    case 'UPDATE_CREDIT': 
      return {...state, user: {...state.user, credit: action.data}}
    case 'UPDATE_HEADER_NAME':
      return {...state, user: {...state.user, firstName: action.data.firstName, lastName: action.data.lastName}};
    case 'UPDATE_HEADER_AVATAR':
      return {...state, user: {...state.user, avatar: action.data.avatar}};
    default:
      return state;
  }
}

export default HeaderInfo;