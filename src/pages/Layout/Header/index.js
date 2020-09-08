
import React from "react";
import "./header.scss";
import menuList from "@/config/menuConfig";
import { withRouter, Link} from "react-router-dom";
import { formatDate } from "@/utils/dateUtils.js";
import { removeToken } from '@/services/authorize.js';
import { signOut } from '@/pages/api';
import { parseResList, parseResSubmit, parseResDetail } from '@/services/requestApi';

class MyHeader extends React.Component{

    constructor(){
        super();
        this.state = {
            currentTime: formatDate(new Date()),
        };
    }

    showTime = () => {
        this.timer = setInterval(() => {
            const currentTime = new Date();
            // console.log(currentTime);
            this.setState({currentTime: formatDate(currentTime)})
        }, 1000);
    }

    getTitle= (list) => {
        // debugger
        const path = this.props.location.pathname;
        for(const item of list){
            if(item.children){
                this.getTitle(item.children);
            }else{
                if(path === item.key){
                    this.title = item.title;
                }
            }
        }

        return this.title;        
    }

    componentDidMount() {
        this.showTime(); 
    }
    
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    handleLogout = async () => {
      console.log(this.props);
      const response = await signOut();
      const result = parseResSubmit(response);
      console.log(result);
      if(result) {
        removeToken();
        this.props.history.push('/login')
      }
    }

    render() {

        const title = this.getTitle(menuList);
        return (
            <div className="header">
                <div className="header-top">
                    <span>Welcome, <strong>Admin</strong></span>
                    {/* <a href="#">Log out</a> */}
                    {/* <Link to='/login'>Log out</Link> */}
                    <a onClick={this.handleLogout}>Log out</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>
                            {this.state.currentTime}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(MyHeader);