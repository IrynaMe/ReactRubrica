import React from 'react';
import { Outlet } from 'react-router-dom';
import '../App.css';
import NavbarVert from '../components/navbarVert';

function Layout(props) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2">
          <NavbarVert
            // vettoreLink={props.vettoreLink}
            vettoreContatti={props.vettoreContatti}
            title={props.title}
          />
        </div>
        <div className="col-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
