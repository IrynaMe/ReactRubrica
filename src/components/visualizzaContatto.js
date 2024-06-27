import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bgImg from "../images/bg3.png";

function ViasualizzaContatto(props) {
  const {mycolor, setMycolor}=useState();
  const { indiceUtente } = useParams();
  const { vettoreContatti, elimina } = props;
  const navigate = useNavigate();
  const index = parseInt(indiceUtente, 10);
  const contatto = vettoreContatti.find((contatto) => contatto.id === index);

 if (!contatto) {
    return <div>Loading...</div>; // Add a loading indicator while contatto is being fetched
  }
  

  // const { nome, cognome, image, email } = contatto;
  // Destructure contatto object for easy access
  const { image, ...contattoDetails } = contatto;
 
  const imageUrl = 'http://localhost:8080/images/' + image;
  const styles = {
    // textAlign: "center",
    //color: "white", #ffbd37
    background: "#ffbd37",
    //background: "#ffc107",
    //backgroundImage: `url(${bgImg})`,
    //backgroundSize: "cover",
   // backgroundRepeat: "no-repeat",
    //backgroundPosition: "center",
    fontSize: "1rem",
    width: "96%",
    //  marginTop: "10%",
    height: "100vh",
    borderRadius:"0px",
    border:"0px",
   // boxShadow: "20px 0 20px 0 rgba(93, 0, 0, 1)",
   // minWidth: "400px"
  };

  const imgStyle = {
    height: "200px",
    width: "auto",
    margin:"5% 5% 0 5%",
   // border:"5px solid black",
   // borderRadius:"50%",
   // boxShadow: "inset 0 0 20px 20px rgba(0, 0, 0, 1)",
  
  };
/* 
  const handleDelete = () => {
    elimina(index);
    navigate("/"); // Redirect to PrimaPagina
  };
  const redirectToModifica = () => {
    navigate(`/Modifica/${index}`);
  }; */
  const handleGoHome = () => {
    navigate("/"); // Redirect to PrimaPagina
  };



  return (
   
   <div
  className="row"
  style={{
   // backgroundImage: `url(${bgImg})`,
  
  //  backgroundRepeat: "no-repeat",
   // backgroundPosition: "center",
   // height: "100vh",
 
   //minHeight: "100%",
  
  }}
>
      <div className="card p-4 card-warning" style={styles}>
        <h3 style={{marginTop:"15px", textAlign:"center"}}>{props.title}</h3>
        <hr  style={{width:"95%"}}></hr>
        <div className="row" >
          <img
             src={imageUrl|| props.userFoto}
            className="card-img-top col-6 py-2"
            alt="contatto"
            style={imgStyle}
          
          />
          <div className="card-body col-6 p-2" style={{margin:"5% 5% 0 5%"}}>
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
        <div className="col-12" style={{ textAlign:"center" }} >
            <button onClick={handleGoHome} className="btn btn-dark" style={{ width: "30%" }}>
              Home
            </button> 
          </div>
  
      </div>
    </div>
  );
}

export default ViasualizzaContatto;