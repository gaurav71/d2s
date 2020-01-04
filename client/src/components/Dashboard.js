import React, {Component} from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {Redirect} from "react-router-dom";
import config from "../config/config"

class Dashboard extends Component{

    constructor(props){
        super(props);
        this.state = {
            url : "",
            data : "",
            authenticated : true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){
        axios.get(config.nodeServer+"/api/dashboard", {withCredentials:true})
        .then(res=>{
            this.setState({data : res.data})
        })
        .catch(err => {
            this.setState({authenticated : false})
        })
    }

    handleChange(event){
        this.setState({url : event.target.value})
    }

    handleSubmit(event){
        axios.post(config.nodeServer+"/api/download", {url : this.state.url}, {withCredentials:true})
        .then(res=>{console.log(res)})
        .catch(err=>{console.dir(err)})
    }

    handleLogout(event){
        axios.get(config.nodeServer+"/api/auth/logout", {withCredentials: true})
        .then(res=>{
            if(res.data.success){
                this.setState({authenticated : false})
            }
        })
    }


    render(){
        if(this.state.authenticated == false){
            return <Redirect to ="/"/>    
        }
        return(
            <div id="dash-page">
                <Navbar authenticated={true} handleLogout={this.handleLogout}/>
                <InputUrl
                    handleChange = {this.handleChange}
                    handleSubmit = {this.handleSubmit}/>
            </div>
        )
    }
}


const InputUrl = (props) => {
    return (
        <div id="url-box">
            <div className="url-box-item"><input type="text" onChange={props.handleChange}/></div>
            <div className="url-box-item" style={{display:"flex", justifyContent:"center "}}>
                <button id="submit-url" onClick={props.handleSubmit}>Download</button>
            </div>
        </div>
    )
}



export default Dashboard;