import React from 'react';
import { Outlet } from 'react-router-dom';
import '../App.css';
import NavbarVert from '../components/navbarVert';

function Layout({vettoreContatti,title}) {

   return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3">
      
          <NavbarVert
            // vettoreLink={props.vettoreLink}
            vettoreContatti={vettoreContatti}
            title={title}
          />
        </div>
        <div className="col-9">
          <Outlet />
        </div>
      </div>
    </div>
  ); 


}

export default Layout;
