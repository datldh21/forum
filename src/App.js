import "./App.scss";
import Login from "./components/login/Login";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import Header from "./components/header/Header";
import { useDispatch } from "react-redux";
import Home from "./components/home";
import { useEffect, useState } from "react";
import Topic from "./components/topic";

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
                            path="/topic"
                            component={Topic}
                            changePage={() => setPage("topic")}                        
                        />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;