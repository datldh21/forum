const initState = [];
const Item = (state = initState, action) => {
  switch (action.type) {
    case 'SET_ITEM':
      return action.data;
    default:
      return state;
  }
};

export default Item;