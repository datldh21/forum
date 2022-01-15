import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router-dom";
import searchIcon from "../../assets/images/header/search.svg";
import { useState, useEffect, Fragment } from "react";
import Url from "../../util/url";
import axios from "axios";
import ShowTopic from "../topic/showTopic";

const SearchScreen = () => {
    
    const dispatch = useDispatch();
    const history = useHistory();
    const [searchInput, setSearchInput] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const topics = useSelector((state) => state.topics);

    const fetchTopics = async () => {
        const res = await axios.get(Url("topic/1/recent"));
        if (res.data.success) {
            dispatch({ type: "SET_TOPICS", data: res.data.response });
        }
    }  
    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        if (searchInput !== "" ) {
            const filterTask = topics && topics.filter((topic) => {
                return Object.values(topic.name).join("").toLowerCase().includes(searchInput.toLowerCase());
            });
            setFilteredResults(filterTask);
        } else {
            setFilteredResults(topics);
        }
    }, [searchInput]);

    const searchItems = (searchValue) => {
        setSearchInput(searchValue);
    }

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
        dispatch({ type: "SET_TOPICS", data: null });
    }

    return (
        <div className="search-screen container">
            <div className="title">
                <div className="home" onClick={() => clickHome()}>
                    Home
                </div>
                <div className="search-screen-name">
                    / Search
                </div>
            </div>

            <div className="search-topic">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search Topic"
                    onChange={(e) => searchItems(e.target.value)}
                />
                <img className="icon" src={searchIcon} />
            </div>

            {searchInput.length > 0 && filteredResults ? (
                <ShowTopic
                    topics={filteredResults}
                />
            ) : (
                <ShowTopic
                    topics={topics}
                />
            )}
        </div>
    )
}

export default SearchScreen;