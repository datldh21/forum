import { combineReducers } from "redux";
import Page from "./page.reducer";
import Categories from "./categories.reducer";
import Posts from "./posts.reducer";
import HeaderInfo from "./headerInfo.reducer";
import Topics from "./topics.reducer"
import CategoryName from "./categoryName.reducer";
import Users from "./users.reducer";
import InfoUser from "./infoUser.reducer";

export default combineReducers({
    page: Page,
    categories: Categories,
    posts: Posts,
    headerInfo: HeaderInfo,
    topics: Topics,
    categoryName: CategoryName,
    users: Users,
    infoUser: InfoUser,
});
