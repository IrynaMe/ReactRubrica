import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../App.css";
import Layout from "./layout";
import PrimaPagina from "./primaPaggina";
import userFoto from "../images/user1.png";
import ViasualizzaContatto from "./visualizzaContatto";
import AddContatto from "./addContatto";

class App4 extends Component {
  state = {
    contatti: [
      {
        id: 1,
        nome: "Mario",
        cognome: "Rossi",
        image: userFoto,
        email: "mariorossi@gmail.com",
      },
      {
        id: 2,
        nome: "Maria",
        cognome: "Verdi",
        image: userFoto,
        email: "mariverdi@gmail.com",
      },
      {
        id: 3,
        nome: "Gianni",
        cognome: "Bianchi",
        image: userFoto,
        email: "giabia@gmail.com",
      },
      {
        id: 4,
        nome: "Luiggi",
        cognome: "Garibaldi",
        image: userFoto,
        email: "luigari@gmail.com",
      },
    ],
  };

  formInfo = ["nome", "cognome", "image", "email"];

  handleAddContatto = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const newContatto = {
      nome: formData.get("nome"),
      cognome: formData.get("cognome"),
      image: formData.get("image"), 
      email: formData.get("email"),
    };

    const maxId = this.state.contatti.reduce((max, contatto) => {
      return contatto.id > max ? contatto.id : max;
    }, 0);

    const contatto = {
      id: maxId + 1,
      ...newContatto,
    };

    this.setState((prevState) => ({
      contatti: [...prevState.contatti, contatto],
    }));

    // Redirect or navigate to another page after adding
    // You can use react-router-dom's history or Link component for navigation
  };

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Layout vettoreContatti={this.state.contatti} title="Visualizza contatti" />}
          >
            <Route index element={<PrimaPagina title="Prima paggina" />} />

            <Route
              path="/VisualizzaContatto/:indiceUtente"
              element={<ViasualizzaContatto vettoreContatti={this.state.contatti} title="Dettagli del contatto" />}
            />

            <Route
              path="/addContatto"
              element={<AddContatto vettoreFormInfo={this.formInfo} title="Aggiungi un nuovo contatto" onAddContatto={this.handleAddContatto} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App4;
