import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { Logout } from './components/Logout';
import {Navbar} from './components/Navbar';
import { Cart } from './pages/Cart';
import {HomePage} from './pages/HomePage';
import { MyItems } from './pages/MyItems';
import { Profile } from './pages/Profile';

const App = () => {
  return (
    <div>
    <Router>
      <Navbar/>
        <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route exact path="/my-products" element={<MyItems/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/logout" element={<Logout/>} />
          <Route exact path="/profile" element={<Profile/>} />
          <Route exact path="/my-cart" element={<Cart/>} />         
        </Routes>
    </Router>
    </div>
  );
};

export default App;
