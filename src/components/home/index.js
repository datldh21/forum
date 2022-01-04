import "./style.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Url from "../../util/url";
import Category from "../category";
import LastPost from "../post/lastpost";

const Home = () => {

    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories);
    const posts = useSelector((state) => state.posts);
    
    const fetchCategories = async () => {
        const res = await axios.get(Url("category"));
        dispatch({ type: "SET_CATEGORIES", data: res?.data?.response });
    }

    const fetchPosts = async () => {
        const res = await axios.get(Url("post"));
        dispatch({ type: "SET_POSTS", data: res?.data?.response })
    }

    const lastPostInCategory = (id) => {
        if (posts && posts.length > 0) {
            for (let i = posts.length - 1; i >= 0; i--) {
                if (posts[i].categoryId === id) {
                    return posts[i];
                }
            }
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, [])

    return (
        <div className="categories container">
        <div className="title">CATEGORIES</div>
            {categories && categories.length > 0 && categories.map((category, index) => {
                return (
                    <div className="content" key={index}>
                        <Category
                            category={category}
                        />
                        <LastPost
                            post={lastPostInCategory(category._id)}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default Home;