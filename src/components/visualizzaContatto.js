import React from "react";
import { useParams } from "react-router-dom";

function ViasualizzaContatto(props) {
  const { indiceUtente } = useParams();
  const { vettoreContatti } = props;

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
    height: "20rem",
  };
  let imgStyle = {
    height: "100px",
    width: "auto",
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
      </div>
    </div>
  );
}

export default ViasualizzaContatto;
