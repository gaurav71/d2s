import React, {Component} from "react";
import axios from "axios";
import {Redirect} from "react-router-dom";
import { GoogleLoginButton} from "react-social-login-buttons";

import Navbar from "./Navbar"

class Auth extends Component{
    constructor(props){
        super(props);
        this.state = {
            email           : {value:"", valid:false, style:this.validStyle},
            password        : {value:"", valid:false, style:this.validStyle},
            authenticated   : false,
            errors          : "",
            showErrors      : false,
            loading         : false
        }
        this.handleLogin    = this.handleLogin.bind(this);
        this.handleChange   = this.handleChange.bind(this);
    }

    async componentDidMount(){
        const res = await axios.get("/api/auth/loginWithSession", {withCredentials: true});
        if(res.data.success === "authenticated")
            this.setState({authenticated:true});
    }

    handleChange(event){
        const {name, value} = event.target;
        const valid = this.getValidation(name, value);
        var style = this.validStyle;
        if(value!=="" && valid === false){
            style = this.notValidStyle;
        }
        this.setState({
            [name] : {value, valid, style},
            errors : "",
            showErrors : false
        })
    }

    
    
    async handleLogin(event){
        event.preventDefault();
        this.setState({loading : true, showErrors:false});
        const {email, password} = this.state;
        if(email.valid===false || password.valid===false){
            return this.setState({showErrors : true, loading:false})
        }
        try{
            const res =  await axios.post("/api/auth/login", 
            {email:email.value, password:password.value}, {withCredentials: true});
            if(res.data.success)
                return this.setState({authenticated:true, loading:false})
            if(res.data.error)
                return this.setState({showErrors:true, errors:res.data.error, loading:false})
        }
        catch(error){
            return this.setState({showErrors:true, errors:"server error", loading:false})
        }
    }

    getValidation(name, value){
        switch(name){
            case "email":{
                const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return emailRegex.test(value);
            }
            case "password":{
                return value.length>=8;
            }
        }
    }

    notValidStyle = {
        borderColor : "Tomato",
    }

    validStyle = {
        borderColor : "DodgerBlue"
    }

    render(){

        if(this.state.authenticated){
            return <Redirect to="/dashboard"/>
        }
        
        return (
            <div style={{width:"100%",height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
            <div id="auth-page">
                <Navbar authenticated={false}/>
                
                <Title 
                    title         = "Login" 
                    loading       = {this.state.loading}
                    errors        = {this.state.errors}
                    showErrors    = {this.state.showErrors}
                    emailValid    = {this.state.email.valid}
                    passwordValid = {this.state.password.valid}/>

                <Form
                    emailStyle      = {this.state.email.style}
                    passwordStyle   = {this.state.password.style}
                    handleChange    = {this.handleChange}
                    handleLogin     = {this.handleLogin}
                    handleRegister  = {this.handleRegister}/>
                <SocialLogin />
            </div>
            </div>
        )
    }
}


const Title = (props) => {
    const display = props.loading?"block":"none"
    return (
        <div id="title">
            <h1>{props.title}</h1>
            <div style={{display}} className="loader"></div>
            <Errors 
                errors        = {props.errors}
                showErrors    = {props.showErrors}
                emailValid    = {props.emailValid}
                passwordValid = {props.passwordValid}/>
        </div>
    )
}

const Errors = (props) => {
    const display = props.showErrors?"block":"none";
    const errors = [props.errors, props.emailValid?"":<div>Email must be valid</div>,
                   props.passwordValid?"":<div>Password length must be more than 8</div>]
    return <div style={{display, color:"Tomato"}}>{errors}</div>
}




const Form = (props) => {
    return (
        <form id="login-box">
            <div className="input">
                <div><label htmlFor="email">Email: </label></div>
                <div className="center"><input type="text" name="email" style={props.emailStyle} onChange={props.handleChange} required/></div>
            </div>
            <div className="input">
                <div><label htmlFor="password">Password: </label></div>
                <div className="center"><input type="password" name="password" style={props.passwordStyle} onChange={props.handleChange} required/></div>
            </div>
            <div id="log-reg-buttons">
                <button type="submit" onClick={props.handleLogin}>Login</button>
                <div id="or">{"-- OR --"}</div>        
                
            </div>
        </form>
        
    )
}

const SocialLogin = (props) => {
    return (
        <div id="social-log-buttons">
            <a href="/api/auth/google">
                <GoogleLoginButton 
                    onClick = {(e)=>{e.preventDefault()}}
                    iconSize="22px" 
                    style={{fontSize:"16px", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center"}} 
                    size="40px" align="center"/>
            </a>
        </div>
    )
}


export default Auth;

