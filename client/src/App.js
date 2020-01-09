import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Link, Redirect} from 'react-router-dom';
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Portfolio from "./components/Portfolio";


import './App.scss';

class App extends Component {
  
  render(){
    return (
      <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/dashboard" component = {Dashboard}/>
          <Route path="/" component = {Auth}/>
        </Switch>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
