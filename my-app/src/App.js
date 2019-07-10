import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LandingPage from './Models/LandingPage'
import NavBar from './Models/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Route exact={true} path="/" render={() => (<div>
        <NavBar/>
        <LandingPage />
      </div>)} />
    </BrowserRouter>
  );
}

export default App;
