import React, {Component} from "react";
import Navbar from "./Navbar";
import DevIcon from "devicon-react-svg";

const devIconStyle = {
    fill: "white",
    width: "75px",
};

class Portfolio extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="portfolio-page">
                <Navbar />
                <Description />
                <Technologies />
                <Projects />
            </div>
        )
    }
}


const Description = (props) => {
    return(
        <div id="desc" className="portfolio-box">
            Hi, I am Gaurav
        </div>
    )
}




const Technologies = (props) => {
    var icons = ["javascript", "sass", "react", "nodejs"];
    icons = icons.map(icon => {
        return (
            <div id="icons">
                <DevIcon icon={icon} style={devIconStyle}/>
                <div>{icon}</div>
            </div>
        )
    })
    return(
        <div id="tech" className="portfolio-box">
            {icons}
        </div>
    )
}




const Projects = (props) => {
    var icons = ["codepen", "github"];
    icons = icons.map(icon => {
        return (
            <div id="icons">
                <DevIcon icon={icon} style={devIconStyle}/>
                <div>{icon}</div>
            </div>
        )
    })
    return(
        <div id="projects" className="portfolio-box">
            {icons}
        </div>
    )
}




export default Portfolio;