import "./App.scss";
import Login from "./components/login/Login";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Profile from "./components/user/index";
import UserScreen from "./components/user/UserScreen";
import AuthRoute from "./components/AuthRoute";
import Items from "./components/item/index";
import Header from "./components/Header";
import { useDispatch } from "react-redux";
import Home from "./components/home";
import Dashboard from "./components/dashboard";
import BackLog from "./components/dashboard/backlog";

import { useEffect, useState } from "react";
import NextSprint from "./components/dashboard/next-sprint";

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
                    <div className="header container">
                        <Header page={page} />
                    </div>
                    <Switch>
                        <Route exact path="/login">
                            <Login changePage={() => setPage("Login")} />
                        </Route>
                        <AuthRoute
                            exact
                            path="/profile"
                            component={Profile}
                            changePage={() => setPage("Profile")}
                        />
                        <AuthRoute
                            exact
                            path="/item"
                            component={Items}
                            changePage={() => setPage("Item")}
                        />
                        <AuthRoute
                            exact
                            path="/"
                            component={Home}
                            changePage={() => setPage("Home")}
                        />
                        <AuthRoute
                            exact
                            path="/dashboard"
                            component={Home}
                            changePage={() => setPage("Dashboard")}
                        />
                        <AuthRoute
                            exact
                            path="/user/:id"
                            component={UserScreen}
                            changePage={() => setPage("Profile")}
                        />
                        <AuthRoute
                            exact
                            path="/shop"
                            component={Home}
                            changePage={() => setPage("Shop")}
                        />
                        <AuthRoute
                            exact
                            path="/notifications"
                            component={Home}
                            changePage={() => setPage("Notifications")}
                        />
                        <AuthRoute
                            exact
                            path="/active-sprint"
                            component={Dashboard}
                            changePage={() => setPage("active-sprint")}
                        />
                        <AuthRoute
                            exact
                            path="/back-log"
                            component={BackLog}
                            changePage={() => setPage("back-log")}
                        />
                        <AuthRoute
                            exact
                            path="/next-sprint"
                            component={NextSprint}
                            changePage={() => setPage("next-sprint")}
                        />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
