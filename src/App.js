import "./App.scss";
import Login from "./components/login/Login";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import Header from "./components/header/Header";
import { useDispatch } from "react-redux";
import Home from "./components/home";
import { useEffect, useState } from "react";
import Topic from "./components/topic";
import Popular from "./components/popular";
import Recent from "./components/recent";
import Users from "./components/users";
import Profile from "./components/profile";
import TopicPosts from "./components/post/topicPosts";
import SearchScreen from "./components/search-screen";

function App() {
    const [page, setPage] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: "SET_PAGE", data: page });
    });
    
    return (
        <div className="App">
            <Router>
                <div className="app-main">
                    <Header />
                    <Switch>
                        <Route exact path="/login">
                            <Login changePage={() => setPage("Login")} />
                        </Route>
                        <AuthRoute
                            exact
                            path="/"
                            component={Home}
                            changePage={() => setPage("home")}                        
                        />
                        <AuthRoute
                            exact
                            path="/category/:id"
                            component={Topic}
                            changePage={() => setPage("topic")}                        
                        />
                        <AuthRoute
                            exact
                            path="/popular"
                            component={Popular}
                            changePage={() => setPage("popular")}                        
                        />
                        <AuthRoute
                            exact
                            path="/recent"
                            component={Recent}
                            changePage={() => setPage("recent")}                        
                        />
                        <AuthRoute
                            exact
                            path="/users"
                            component={Users}
                            changePage={() => setPage("users")}                        
                        />
                        <AuthRoute
                            exact
                            path="/user/:id"
                            component={Profile}
                            changePage={() => setPage("user")}                        
                        />
                        <AuthRoute
                            exact
                            path="/topic/:id"
                            component={TopicPosts}
                            changePage={() => setPage("posts")}                        
                        />
                        <AuthRoute
                            exact
                            path="/search"
                            component={SearchScreen}
                            changePage={() => setPage("search")}                        
                        />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;