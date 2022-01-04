import { combineReducers } from "redux";
import Page from "./page.reducer";
import Categories from "./categories.reducer";
import Posts from "./posts.reducer";

export default combineReducers({
    page: Page,
    categories: Categories,
    posts: Posts,
});
