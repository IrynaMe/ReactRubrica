
import React from 'react';
import { Outlet } from 'react-router-dom';
import '../App.css';
import NavbarVert from '../components/navbarVert';

function Layout({ vettoreContattiSorted, title, onBulkDelete, selectedContacts, updateSelectedContacts, handleCheckboxChange, setSelectedContacts }) {

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3">

          <NavbarVert
            // vettoreLink={props.vettoreLink}
            vettoreContattiSorted={vettoreContattiSorted}
            title={title}
            onBulkDelete={onBulkDelete}
            selectedContacts={selectedContacts}
            updateSelectedContacts={updateSelectedContacts}

            handleCheckboxChange={handleCheckboxChange}
            setSelectedContacts={setSelectedContacts}
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