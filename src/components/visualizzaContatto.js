import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ViasualizzaContatto(props) {
  const {mycolor, setMycolor}=useState();
  const { indiceUtente } = useParams();
  const { vettoreContatti, elimina } = props;
  const navigate = useNavigate();
  const index = parseInt(indiceUtente, 10);
  const contatto = vettoreContatti.find((contatto) => contatto.id === index);

  // const { nome, cognome, image, email } = contatto;
  // Destructure contatto object for easy access
  const { image, ...contattoDetails } = contatto;

  const styles = {
    // textAlign: "center",
    //color: "white",
    // background: "orange",
    // fontSize: "12px",
    width: "30rem",
    //  marginTop: "10%",
    height: "25rem",
  };

  const imgStyle = {
    height: "100px",
    width: "auto",
  };

  const handleDelete = () => {
    elimina(index);
    navigate("/"); // Redirect to PrimaPagina
  };

  const redirectToModifica = () => {
    navigate(`/Modifica/${index}`);
  };

  return (
    <div className="row justify-content-center">
      <div className="card p-4" style={styles}>
        <h3>{props.title}</h3>
        <div className="row">
          <img
            src={image}
            className="card-img-top col-4 p-2"
            alt="contatto"
            style={imgStyle}
          />
          <div className="card-body col-8 p-2">
            {Object.keys(contattoDetails).map((key) => (
              <p key={key}>
                {key}: {contattoDetails[key]}
              </p>
            ))}
          </div>
        </div>
{/*         <div className="row mt-3">
          <div className="col-6">
            <button onClick={redirectToModifica} className="btn btn-dark w-100">
              Modifica
            </button>
          </div>
          <div className="col-6">
            <button onClick={handleDelete} className="btn btn-dark w-100">
              Cancella
            </button> 
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default ViasualizzaContatto;