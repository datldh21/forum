const initState = {
  data: null,
}
const Request = (state = initState, action) => {
  switch (action.type) {
    case 'SET_REQUEST':
      return { ...state, data: action.data };
    case 'UPDATE_REQUEST':
      if (state && state.length != 0) {
        return { ...state, 
          data: {
            ...state.data,
            avatar: action.data,
            name: action.data,
            imgItem: action.data,
            price: action.data,
            date: action.data,
            seen: action.data
          }
        }
      } else {
        return {
          data: {
            ...state.data,
            avatar: action.data,
            name: action.data,
            imgItem: action.data,
            price: action.data,
            date: action.data,
            seen: action.data
          }
        }
      }
    case 'DELETE_REQUEST':
      const dataDelete = action.data;
      var arr = state.map((item) => {
        return {
          id: item.id,
          userId: item.userId,
          username: item.username,
          item: item.item,
          status: item.status,
          description: item.description
        }
      })
      arr = arr.filter(function (item) {
        return (item.id != dataDelete.id);
      })
      return arr;
    default:
      return state;
  }
};

export default Request;