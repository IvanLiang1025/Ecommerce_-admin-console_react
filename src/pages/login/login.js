

import React from "react";
import "./login.scss";
import logo from "../../images/logo.png";
// import LoginForm from "../../components/forms/loginForm";
import { Form, Button, Input, Icon, message } from "antd";
import axios from "axios";
import { apiPost } from '../../services/adminApi';
// import { apiPost } from '@/services/api';
import { authorize } from '../../services/authorize';
import { Redirect } from 'react-router-dom';
// import { apiPost } from 'services/api';
import { signIn } from '@/pages/api';
import { parseResList, parseResSubmit, parseResDetail } from '../../services/requestApi';



class Login extends React.Component {

  state = {
    redirect: false
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      if (err) {
        return;
      } else {
        this.gotoSignIn(values)
      }
    })
  }

  gotoSignIn = async (values) => {
    const response = await signIn(values);
    const result = parseResSubmit(response);
    if (result) {
      authorize(result);
      this.setState({
        redirect: true
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { redirect } = this.state;

    // 声明式验证
    const userInputOptions = {
      rules: [
        { required: true, message: "Input user name please " },
        { min: 6, message: "At least 6 characters" },
        { max: 20, message: "At most 20 characters" },
      ]
    }

    //custom validator
    const validator = (rule, value, callback) => {
      if (!value) {
        callback("Please input user name");
      } else if (value.length < 6) {
        callback("At least 6 characters");
      } else if (value.length > 20) {
        callback("At most 20 characters");
      } else {
        callback()

      }

      // callback("sdfdsf") //meaning errors, and error message is sdfdsf;
    }
    const pwdInputOptions = {
      rules: [
        { validator }
      ]
    }

    if (redirect) {
      return <Redirect to="/home"></Redirect>
    }

    return (
      <div className="login">
        <div className="login-header">
          <div className="login-header-wrapper">
            <img className="login-header-img" src={logo} alt="logo"></img>
            <div className="login-header-title"> Shiny Admin System</div>
          </div>

        </div>
        <div className="login-content-container">
          <div className="login-content">
            <h2 className="login-content-title">Log in</h2>
            <div className="login-form-wrapper">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  {
                    getFieldDecorator("email", userInputOptions)(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="email"
                      />
                    )
                  }

                </Form.Item>
                <Form.Item>
                  {
                    getFieldDecorator("password", pwdInputOptions)(
                      <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                      />
                    )
                  }
                </Form.Item>
                <Form.Item>

                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                  </Button>

                </Form.Item>
              </Form>
            </div>
          </div>


        </div>
      </div>
    )
  }
}
const WrapLogin = Form.create()(Login);
export default WrapLogin;