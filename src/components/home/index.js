import "./style.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Url from "../../util/url";
import Category from "../category";

const Home = () => {

    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories);
    
    const fetchCategories = async () => {
        const res = await axios.get(Url("category"));
        dispatch({ type: "SET_CATEGORIES", data: res?.data?.response });
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    return (
        <div className="categories container">
            <div className="title">CATEGORIES</div>
            {categories && categories.length > 0 && categories.map((category, index) => {
                return (
                    <Category
                        category={category}
                    />
                )
            })}
        </div>
    )
}

export default Home;