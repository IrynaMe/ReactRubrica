import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from './modal'; // Adjust the path as needed
import bgImg from '../images/bgImg1.png';

function PrimaPagina({ vettoreContatti, title }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [startsWithQuery, setStartsWithQuery] = useState('');
  const [filteredContatti, setFilteredContatti] = useState([]);
  const [selectedContatto, setSelectedContatto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const styles = {
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    minHeight: '100vh',
  };

  // Function to filter contacts based on search query
  const handleSearch = (query) => {
    const searchString = query.toLowerCase();
    const filteredContacts = vettoreContatti.filter((contatto) =>
      contatto.nome.toLowerCase().includes(searchString) ||
      contatto.cognome.toLowerCase().includes(searchString) ||
      contatto.indirizzo.toLowerCase().includes(searchString) ||
      contatto.comune.toLowerCase().includes(searchString)
    );
    setFilteredContatti(filteredContacts);
  };

  // Function to filter contacts by nome or cognome starting with a specific sequence
  const handleStartsWithSearch = (query) => {
    const startsWithString = query.toLowerCase();
    const filteredContacts = vettoreContatti.filter((contatto) =>
      contatto.nome.toLowerCase().startsWith(startsWithString) ||
      contatto.cognome.toLowerCase().startsWith(startsWithString)
    );
    setFilteredContatti(filteredContacts);
  };

  // Function to handle opening the modal with contact details
  const openModal = (contatto) => {
    setSelectedContatto(contatto);
    setModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setSelectedContatto(null);
    setModalOpen(false);
  };

  // Function to handle input change for general search
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'searchQuery') {
      setSearchQuery(value);
      if (value.trim() === '') {
        setFilteredContatti([]);
      } else {
        handleSearch(value);
      }
    } else if (name === 'startsWithQuery') {
      setStartsWithQuery(value);
      if (value.trim() === '') {
        setFilteredContatti([]);
      } else {
        handleStartsWithSearch(value);
      }
    }
  };

  return (
    <div className="container" style={styles}>
      <br />
      <h3 style={{ textAlign: 'center', fontSize: '30px' }}>{title}</h3>
      <br />
      {/* General search */}
      <input
        type="text"
        placeholder="Cerca se contatto contiene..."
        className="form-control"
        name="searchQuery"
        value={searchQuery}
        onChange={handleChange}
        style={{ maxWidth: '400px', margin: 'auto', marginBottom: '20px' }}
      />
      {/* Starts with search */}
      <input
        type="text"
        placeholder="Cerca nome o cognome inizia da..."
        className="form-control"
        name="startsWithQuery"
        value={startsWithQuery}
        onChange={handleChange}
        style={{ maxWidth: '400px', margin: 'auto', marginBottom: '20px' }}
      />
      <hr />
      <div className="row mt-5">
        <div className="col-4">
          {/* List of filtered contacts */}
          
          {filteredContatti.length > 0 && (
            <div className="contact-list-container" style={{ overflowY: 'auto', textAlign: 'center' }}>
              {/* <p >Contatti trovati:</p> */}
              <ul className="nav flex-column mx-5">
                {filteredContatti.map((contatto) => (
                  <li className="nav-item" key={contatto.id}>
                    {/* Instead of Link, open modal on click */}
                    <button className="nav-link text-dark" onClick={() => openModal(contatto)}>
                      {`${contatto.nome} ${contatto.cognome}`}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Message when no contacts are found */}
          
          {filteredContatti.length === 0 && (searchQuery.trim() !== '' || startsWithQuery.trim() !== '') && (
            <p >Nessun contatto trovato</p>
          )}
        </div>
        <div className="col-8">
          {/* Modal to display contact details */}
          {selectedContatto && (
            <Modal isOpen={modalOpen} closeModal={closeModal}>
              <div className="row">
                <div className="col-5 mt-3">
                  <img
                    src={`http://localhost:8080/images/${selectedContatto.image}`}
                    alt="contatto"
                    style={{ height: '200px', width: 'auto', margin: '0% 0% 0 0%' }}
                  />
                </div>
                <div className="col-7 mt-3" style={{ margin: '0% 0% 0 0%' }}>
                  {Object.keys(selectedContatto).map((key) => (
                    key !== 'image' && key !== 'abilitato' && (
                      <p key={key}>
                        {key}: {selectedContatto[key]}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrimaPagina;
