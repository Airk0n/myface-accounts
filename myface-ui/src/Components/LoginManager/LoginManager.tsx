import React, {createContext, ReactNode, useState} from "react";
import {Login} from "../../Pages/Login/Login";

export const LoginContext = createContext({
    username: "",
    password: "",
    isLoggedIn: false,
    isAdmin: false,
    logIn: () => {},
    logOut: () => {},
    setUsername: (name : string) => {},
    setPassword: (pw : string) => {}
});

interface LoginManagerProps {
    children: ReactNode
}

export function LoginManager(props: LoginManagerProps): JSX.Element {
    const [loggedIn, setLoggedIn] = useState(false);
    const [newUsername, setusername] = useState("");
    const [newPassword, setpassword] = useState("");
    
    function logIn() {
        setLoggedIn(true);
    }
    
    function logOut() {
        setLoggedIn(false);
    }

    function setPassword(newPW : string) {
        setpassword(newPW);
    }

    function setUsername(newname : string) {
        setusername(newname);
    }


    const context = {
        username: newUsername,
        password: newPassword,
        isLoggedIn: loggedIn,
        isAdmin: loggedIn,
        logIn: logIn,
        logOut: logOut,
        setPassword: setPassword,
        setUsername: setUsername
    };
    
    return (
        <LoginContext.Provider value={context}>
            {props.children}
        </LoginContext.Provider>
    );
}