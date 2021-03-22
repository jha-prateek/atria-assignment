import React from 'react';
import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App jumbotron jumbotron-fluid bg-transparent m-0">
      <Dashboard/>
    </div>
  );
}

export default App;
