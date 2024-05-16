import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { Logout } from './components/Logout';
import {Navbar} from './components/Navbar';
import {HomePage} from './pages/HomePage';


const App = () => {
  return (
    <div>
    <Router>
      <Navbar/>
        <Routes>
          <Route exact path="/home" element={<HomePage/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/logout" element={<Logout/>} />
        </Routes>
    </Router>
    </div>
  );
};

export default App;
