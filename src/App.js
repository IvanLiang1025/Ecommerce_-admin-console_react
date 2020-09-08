import React from 'react';

import "antd/dist/antd.css"

import AdminLayout from '@/pages/Layout/AdminLayout';
import Login from "./pages/login/login.js";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AdminRoute from '@/AuthRoute';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login}></Route>
        <AdminRoute path='/' component={AdminLayout}></AdminRoute>
        {/* <Route path="/" component={AdminLayout}></Route> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
