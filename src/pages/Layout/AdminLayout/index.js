

import React from "react";
import { Layout } from "antd";
import MyHeader from "../Header";
import LeftNav from "../LeftNav";
import { Switch, Route, Redirect } from "react-router-dom";
import Product from "@/pages/Product/Product.js";
import Home from "@/pages/Home/Home.js";
import Category from "@/pages/Category/Category.js";
import Orders from '@/pages/Orders';
import Users from '@/pages/User';
import { normalize } from "path";


const { Header, Footer, Content, Sider } = Layout;

class Admin extends React.Component {

  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    console.log("Admin")
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <LeftNav></LeftNav>
        </Sider>
        <Layout >
          <MyHeader></MyHeader>
          <div style={{ margin: "25px", backgroundColor: "white", display: 'block' }}>
            <Switch>
              <Route path="/product" exact component={Product}></Route>
              <Route path="/home" component={Home}></Route>
              <Route path="/category" exact component={Category}></Route>
              <Route path="/orders" exact component={Orders}></Route>
              <Route path="/users" exact component={Users}></Route>
              <Redirect to="/home"></Redirect>
            </Switch>
          </div>
        </Layout>
      </Layout>
    )
  }
}

export default Admin;