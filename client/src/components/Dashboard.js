import React, {Component}   from "react";
import axios                from "axios";
import Navbar               from "./Navbar";
import {Redirect}           from "react-router-dom";
import io                   from "socket.io-client";


class Dashboard extends Component{

    constructor(props){
        super(props);
        this.state = {
            url : null,
            authenticated : false,
            loading : true,
            downloadStatus : "idle",        // [idle || loading || loaded || downloading || uploading || finished || error] // 
            file : {name:"", size:null, recieved:null, percent:null}
        }
        this.handleChange   = this.handleChange.bind(this);
        this.handleSubmit   = this.handleSubmit.bind(this);
        this.handleLogout   = this.handleLogout.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }


    
    async componentDidMount(){
        try{
            await axios.get("/api/dashboard", {withCredentials:true});
            this.setState({loading : false, authenticated : true})  
        }
        catch(err){
            this.setState({authenticated : false, loading:false});
        }
    }



    handleChange(event){
        this.setState({url : event.target.value})
    }





    async handleSubmit(){
        this.setState({downloadStatus : "loading"});
        try{
            const res = await axios.post("/api/download/getFileDetails", 
                        {url : this.state.url}, {withCredentials:true});
            this.setState({file : {
                name : res.data.name,
                size : res.data.size
            }})
            this.setState({downloadStatus : "loaded"});
        }
        catch(error){
            this.setState({downloadStatus : "error"});
        }
    }






    async handleDownload(){
        this.setState({downloadStatus : "getting ready"})
        const socket = io();
        try{
            socket.emit("join");
            socket.on("downloading", (recieved) => {
                this.setState((state)=>{
                    const percent = state.file.size ? 
                                    Math.floor(recieved/state.file.size*100) : 
                                    null;
                    return {
                        downloadStatus : "downloading",
                        file : {...state.file, recieved, percent}
                    }
                })
            })
            socket.on("uploading", () => {
                this.setState({downloadStatus : "uploading"});
            })
            await axios.post("/api/download/", 
                            {url : this.state.url}, {withCredentials:true});
            socket.disconnect();
            this.setState({downloadStatus : "finished"});
        }
        catch(err){
            socket.disconnect();
            this.setState({downloadStatus : "error"})
        }
    }





    async handleLogout(event){
        await axios.get("/api/auth/logout", {withCredentials: true});
        this.setState({authenticated : false});
    }




    render(){

        if(this.state.loading){
            return( 
            <div style={{
                width:"100vw", 
                height:"90vh", 
                display:"flex", 
                alignItems:"center", 
                justifyContent:"center"}}>
                {getLoader()}
            </div>)
        }

        if(this.state.authenticated === false){
            return <Redirect to ="/"/>    
        }

        

        return(
            <div id="dash-page">
                <Navbar authenticated={true} handleLogout={this.handleLogout}/>
                <InputUrl
                    handleChange = {this.handleChange}
                    handleSubmit = {this.handleSubmit}/>
                <Download 
                    downloadStatus = {this.state.downloadStatus}
                    file = {this.state.file}
                    handleDownload = {this.handleDownload}/>
            </div>
        )
    }
}





const InputUrl = (props) => {
    return (
        <div id="url-box" className="dash-child">
            <input type="text" onChange={props.handleChange}/>
            <button id="submit-url" onClick={props.handleSubmit}>Download</button>
        </div>
    )
}




const Download = (props) => {

    if(props.downloadStatus === "idle"){
        return <div></div>
    }

    if(props.downloadStatus === "loading"){
        return getLoader();
    }

    if(props.downloadStatus === "error"){
        return <div style={{color:"red"}}>Error</div>
    }
    
    var child = <StartDownload handleDownload = {props.handleDownload} />

    if(props.downloadStatus === "getting ready"){
        child = getLoader();
    }

    else if(props.downloadStatus !== "loaded"){
        child = <ProgressBar file = {props.file} />
    }
    
    return (
        <div id="download-status" className="dash-child">
            <FileDetails 
                file = {props.file}
                downloadStatus = {props.downloadStatus}/>
            <div className  = "dash-child">
                {child}
            </div>
        </div>
            
    )

}





const FileDetails = (props) => {
    const status = props.downloadStatus;
    const statusStyle = {
        color : "green"
    }
    if(status === "uploading"){
        statusStyle.color = "blue"
    }
    if(status === "error"){
        statusStyle.color = "red"
    }
    return(
        <div id="download-details">
            <div id="left-box" className="box">
                <div className="box-item">Status : </div>
                <div className="box-item">Filename : </div>
                <div className="box-item">Size : </div>
                <div className="box-item">Downloaded : </div>
            </div>

            <div id="right-box" className="box">
                <div className="box-item" style={statusStyle}>{status}</div>
                <div className="box-item">{props.file.name}</div>
                <div className="box-item">{humanFileSize(props.file.size)}</div>
                <div className="box-item">{humanFileSize(props.file.recieved||0)}</div>
            </div>
        </div>
    )
}







const StartDownload = (props) => {
    return (<button id="start-download" 
                    className="dash-button" 
                    onClick={()=>{props.handleDownload()}}>Start
            </button>
        )
}





const ProgressBar = (props) => {
    return (
        <div id="progress">
    <span id="percent">{props.file.percent +" %"}</span>
    <div id="progress-bar" style={{width : props.file.percent+"%"}}></div>
</div>
    )
}




const getLoader = () => {
    return (<div> <div className="loader"/> </div>)
}


function humanFileSize(bytes) {
    if(!bytes || bytes==null) return "N/A"; 
    var thresh = 1000;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}






export default Dashboard;