import { combineReducers } from "redux";
import Page from "./page.reducer";
import Categories from "./categories.reducer";
import Posts from "./posts.reducer";
import HeaderInfo from "./headerInfo.reducer";
import Topics from "./topics.reducer"
import CategoryNow from "./categoryNow.reducer";
import Users from "./users.reducer";
import InfoUser from "./infoUser.reducer";
import UserPosts from "./userPosts.reducer";
import TopicPosts from "./topicPosts.reducer";

export default combineReducers({
    page: Page,
    categories: Categories,
    posts: Posts,
    headerInfo: HeaderInfo,
    topics: Topics,
    categoryNow: CategoryNow,
    users: Users,
    infoUser: InfoUser,
    userPosts: UserPosts,
    topicPosts: TopicPosts,
});
