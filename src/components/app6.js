import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../App.css";
import Layout from "./layout";
import PrimaPagina from "./primaPaggina";
//import userFoto from "../images/user1.png";
import ViasualizzaContatto from "./visualizzaContatto";
import AddContatto from "./addContatto";
import ModificaContatto from "./modificaContatto";
import comuniFile from "../files/comuni.csv";

function App6(props) {
  const [vettoreContatti, aggiornaVettore] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const ip_server = window.ip_server_rest;
  const porta_server = window.porta_server_rest;
  
const readCsvFile = async (filePath) => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
    }
    const csvText = await response.text();
    console.log("CSV Text:", csvText); // Debugging output

    const rows = csvText.split("\n").map(row => row.trim()).filter(row => row !== '');
    const data = rows.map((comune) => ({ comune }));
    console.log("Parsed Data:", data); // Debugging output

    return data;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return [];
  }
};

  const updateSelectedContacts = (newContacts) => {
    setSelectedContacts(newContacts);
  };

  const handleCheckboxChange = (id) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((contactId) => contactId !== id)
        : [...prevSelected, id]
    );
  };

  const getData = () => {
    console.log("Making fetch request to server");
    const url = "http://" + ip_server + ":" + porta_server + "/scuola/rubricadb";
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data fetched from server:", data);
        aggiornaVettore(data);
      })
      .catch((error) => {
        console.error("Error fetching data from server:", error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const formInfo = ["nome", "cognome", "image", "email", "telefono", "comune","indirizzo", "nascita"]; 

  const cancella = (id) => {
    aggiornaVettore((prevContatti) =>
      prevContatti.map((contatto) =>
        contatto.id === id ? { ...contatto, abilitato: 0 } : contatto
      )
    );
  };

  const handleAddContatto = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("abilitato", "1");

 // Format data di nascita as a date string (assuming it's a Date object)
 formData.append("nascita", formData.get("nascita").toISOString());
    try {
      const response = await fetch("http://" + ip_server + ":" + porta_server + "/scuola/rubricainsert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);

        const newContatto = {
          id: result.id,
          nome: formData.get("nome"),
          cognome: formData.get("cognome"),
          image: formData.get("image")||null,
          email: formData.get("email"),
          telefono: formData.get("telefono")||"",
          comune:formData.get("comune")||"",
          indirizzo:formData.get("indirizzo")||"",
          nascita:formData.get("nascita")||null,
          abilitato: 1,
        };

        aggiornaVettore((prevContatti) => [...prevContatti, newContatto]);
      } else {
        const errorText = await response.text();
        console.error("Error:", response.statusText, errorText);
        alert("Error: " + response.statusText + " - " + errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
  };

  const handleUpdateContatto = (id, updatedContatto) => {
    aggiornaVettore((prevContatti) =>
      prevContatti.map((contatto) =>
        contatto.id === id ? { ...contatto, ...updatedContatto } : contatto
      )
    );
  };

  const handleBulkDelete = (selectedContacts) => {
    aggiornaVettore((prevContatti) =>
      prevContatti.map((contatto) =>
        selectedContacts.includes(contatto.id)
          ? { ...contatto, abilitato: 0 }
          : contatto
      )
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              vettoreContatti={vettoreContatti}
              title="Visualizza contatti"
              onBulkDelete={handleBulkDelete}
              selectedContacts={selectedContacts}
              updateSelectedContacts={updateSelectedContacts}
              handleCheckboxChange={handleCheckboxChange}
              setSelectedContacts={setSelectedContacts}
              loading={loading} // Pass loading state to Layout x evitare errore when server is down
            />
          }
        >
          <Route index element={
            <PrimaPagina 
            title="Benvenuti alla rubrica"
            vettoreContatti={vettoreContatti}
            />} />

          <Route
            path="/VisualizzaContatto/:indiceUtente"
            element={
              <ViasualizzaContatto
                vettoreContatti={vettoreContatti}
                title="Dettagli del contatto"
                elimina={cancella}
                
              />
            }
          />

          <Route
            path="/addContatto"
            element={
              <AddContatto
                vettoreFormInfo={formInfo}
                title="Aggiungi un nuovo contatto"
                onAddContatto={handleAddContatto}
                readCsvFile={readCsvFile}
                vettoreContatti={vettoreContatti}
              />
            }
          />

          <Route
            path="/Modifica/:id"
            element={
              <ModificaContatto
                vettoreContatti={vettoreContatti}
                onUpdateContatto={handleUpdateContatto}
                formInform={formInfo}
                selectedContacts={selectedContacts}
                updateSelectedContacts={updateSelectedContacts}
                handleCheckboxChange={handleCheckboxChange}
                readCsvFile={readCsvFile}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App6;
