const initState = [];

const TopicPosts = (state = initState, action) => {
    switch (action.type) {
        case 'SET_TOPIC_POSTS':
            return action.data;
        default:
            return state;
    }
};

export default TopicPosts;
