 const Point = (state = [], action) => {
  switch (action.type) {
    case 'SET_POINT':
      return action.data;
    // case 'UPDATE_POINT':
    //   return (action.data);
    default:
      return state;
  }
};

export default Point;