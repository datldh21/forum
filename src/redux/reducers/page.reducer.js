const initState = '';
const Page = (state = initState, action) => {
    switch (action.type) {
        case 'SET_PAGE':
            return action.data;
        default:
            return state;
    }
};

export default Page;
