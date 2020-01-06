import React, {Component}   from "react";
import axios                from "axios";
import Navbar               from "./Navbar";
import {Redirect}           from "react-router-dom";
import config               from "../config/config";
import io                   from "socket.io-client";


class Dashboard extends Component{

    constructor(props){
        super(props);
        this.state = {
            url : null,
            authenticated : false,
            loading : true,
            downloadStatus : "idle",
            file : {
                name : null,
                size : null,
                recieved : null,
                percent : null
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    async componentDidMount(){
        try{
            const res = await axios.get(config.nodeServer+"/api/dashboard", {withCredentials:true});
            this.setState({loading : false, authenticated : true})  
        }
        catch(err){
            this.setState({authenticated : false, loading:false});
        }
    }

    handleChange(event){
        this.setState({url : event.target.value})
    }

    async handleSubmit(event){
        this.setState({downloadStatus : "loading"});
        try{
            const socket = io(config.nodeServer);
            socket.emit("join");
            socket.on("downloading", (downloadStatus) => {
                this.setState({
                    downloadStatus : "Downloading", 
                    file : {
                        name     : downloadStatus.fileName,
                        size     : downloadStatus.totalSizeBytes/1000000 + " MB",
                        recieved : downloadStatus.recievedBytes/1000000 + " MB",
                        percent  : downloadStatus.totalSizeBytes ? downloadStatus.totalSizeBytes/downloadStatus.recievedBytes : null
                    }
                });
            })
            socket.on("uploading", () => {
                this.setState({downloadStatus : "Uploading to Drive"});
            })
            const res = await axios.post(config.nodeServer+"/api/download", {url : this.state.url}, {withCredentials:true});
            this.setState({downloadStatus : "Uploaded"});
        }
        catch(err){
            this.setState({downloadStatus : "Download Error"})
        }
    }

    async handleLogout(event){
        const res = await axios.get(config.nodeServer+"/api/auth/logout", {withCredentials: true});
        this.setState({authenticated : false});
    }


    render(){
        if(this.state.loading){
            return <div className="loader"></div>
        }
        if(this.state.authenticated == false){
            return <Redirect to ="/"/>    
        }
        return(
            <div id="dash-page">
                <Navbar authenticated={true} handleLogout={this.handleLogout}/>
                <InputUrl
                    handleChange = {this.handleChange}
                    handleSubmit = {this.handleSubmit}/>
                <DownLoad 
                    downloadStatus = {this.state.downloadStatus}
                    fileName = {this.state.file.name}
                    fileSize = {this.state.file.size}
                    fileRecievedSize = {this.state.file.recieved}/>
            </div>
        )
    }
}

const rowStyle = {
    display : "flex",
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "center"
}


const InputUrl = (props) => {
    return (
        <div id="url-box" style={rowStyle}>
            <div className="url-box-item"><input type="text" onChange={props.handleChange}/></div>
            <div className="url-box-item" style={{display:"flex", justifyContent:"center "}}>
                <button id="submit-url" onClick={props.handleSubmit}>Download</button>
            </div>
        </div>
    )
}

const DownLoad = (props) => {

    if(props.downloadStatus === "loading"){
        return (
            <div id="download-details">
                <div className="loader"/>
            </div>
        )
    }
    const status    = props.downloadStatus;
    const statusStyle = {
        color : "green"
    }
    if(status === "Uploading to Drive"){
        statusStyle.color = "blue"
    }
    if(status === "Downalod Error"){
        statusStyle.color = "red"
    }
    
    return (
        <div id="download-details">
            <div id="left-box" className="box">
                <div className="box-item">Status : </div>
                <div className="box-item">Filename : </div>
                <div className="box-item">Size : </div>
                <div className="box-item">Downloaded : </div>

            </div>

            <div id="right-box" className="box">
                <div className="box-item" style={statusStyle}>{status}</div>
                <div className="box-item">{props.fileName}</div>
                <div className="box-item">{props.fileSize}</div>
                <div className="box-item">{props.fileRecievedSize}</div>
            </div>
        </div>
    )
}




export default Dashboard;