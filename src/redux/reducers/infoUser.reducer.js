const initState = [];

const InfoUser = (state = initState, action) => {
    switch (action.type) {
        case 'SET_INFO_USER':
            return action.data;
        default:
            return state;
    }
};

export default InfoUser;
