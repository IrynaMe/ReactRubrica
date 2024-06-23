import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../App.css";
import Layout from "./layout";
import PrimaPagina from "./primaPaggina";
import userFoto from "../images/user1.png";
import ViasualizzaContatto from "./visualizzaContatto";
import AddContatto from "./addContatto";
import ModificaContatto from "./modificaContatto";




function App5(props) {
  const contatti = [
    {
      id: 1,
      nome: "Mario",
      cognome: "Rossi",
      image: userFoto,
      email: "mariorossi@gmail.com",
      telefono: "+39351124568",
      stato: 1,
    }
  ];

  const [vettoreContatti, aggiornaVettore] = useState([]);

  const getData = () => {
    console.log("Making fetch request to server");
    const url = "http://127.0.0.1:8080/scuola/rubricadb";
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
    // const intervalId = setInterval(getData, 5000);
    // return () => clearInterval(intervalId);
  }, []);

  const formInfo = ["nome", "cognome", "image", "email", "telefono", "stato"];

  const cancella = (id) => {
    aggiornaVettore((prevContatti) =>
      prevContatti.map((contatto) =>
        contatto.id === id ? { ...contatto, stato: 0 } : contatto
      )
    );
  };

  const handleAddContatto = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("stato", "1");

    try {
      const response = await fetch("http://localhost:8080/scuola/rubricainsert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);

        // Update the state with the new contact including the ID from the backend
        const newContatto = {
          id: result.id,
          nome: formData.get("nome"),
          cognome: formData.get("cognome"),
          image: formData.get("image"),
          email: formData.get("email"),
          telefono: formData.get("telefono"),
          stato: 1,
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

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout vettoreContatti={vettoreContatti} title="Visualizza contatti" />
          }
        >
          <Route index element={<PrimaPagina title="Prima paggina" />} />

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
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App5;