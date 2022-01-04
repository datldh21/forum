const initState = [];
const HeaderInfo = (state = initState, action) => {
    switch (action.type) {
        case 'SET_HEADER_INFO':
            return action.data;
        default:
            return state;
    }
};

export default HeaderInfo;
