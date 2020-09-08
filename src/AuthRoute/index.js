
import React from "react";
import {isAuthenticated} from "@/services/authorize";
import {Route, Redirect} from "react-router-dom";

const AdminRoute = ({component: Component, ...rest}) => {
    return (
        <Route 
            {...rest} 
            render={(props) => {
                console.log(props);
                return isAuthenticated() && isAuthenticated().user.role === 1 ? (
                    <Component {...props}></Component>
                ) : (
                    <Redirect to={{pathname: "/login", state: {from: props.location}}}></Redirect>
                )
            }
        } /> 
    )
}

export default AdminRoute;