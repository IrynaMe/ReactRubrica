import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import bgImg from "../images/bg3.png";
import userFoto from "../images/user1.png";

function ViasualizzaContatto(props) {
  const { indiceUtente } = useParams();
  const { vettoreContattiSorted, elimina } = props;
  const navigate = useNavigate();
  const index = parseInt(indiceUtente, 10);
  const contatto = vettoreContattiSorted.find((contatto) => contatto.id === index);

  if (!contatto) {
    return <div>Loading...</div>; // Loading indicator while contatto is being fetched
  }

  const { image, ...contattoDetails } = contatto;
  const imageUrl = 'http://localhost:8080/images/' + image;
  const handleGoHome = () => {
    navigate("/");
  };
  const styles = {
    background: "#ffc107",
    fontSize: "1rem",
    minHeight: "100vh",
    borderRadius: "0",
    border: "0",
  };

  const imgStyle = {
    height: "200px",
    width: "auto",
    margin: "20px auto 20px  auto", // Center the img horizontally
    //boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
  };

  return (
    <div className="row justify-content-center">
      <div className="card p-2 card-warning" style={styles}>
        <h3 style={{ marginTop: "15px", textAlign: "center" }}>
          {props.title}
        </h3>
        <hr style={{ width: "96%" }}></hr>
        <div 
          className="row col-md-12 py-4 justify-content-center mt-5" 
          style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
           // border: '1px solid white',
            borderRadius: '8px', 
            width: "70%", 
            margin: "0 auto 30px auto" }}
        >
          <div className="col-md-12">
            <div className="row " style={{paddingLeft:"60px",paddingRight:"60px"}}>
              <div className="col-lg-6 col-6 " >
                <img
                  src={imageUrl || userFoto}
                  className="card-img"
                  alt="contatto"
                  style={imgStyle}
                />
              </div>
              <div className="col-lg-6" 
             
              >
                <div className="card-body">
                  {Object.keys(contattoDetails)
                    .filter((key) => key !== "abilitato") // Exclude 'abilitato' 
                    .map((key) => (
                      <p key={key}>
                        {key}: {contattoDetails[key]}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12" style={{ textAlign: "center", marginTop: "10px" }}>
          <button
            onClick={handleGoHome}
            className="btn btn-dark"
            style={{ width: "30%" }}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViasualizzaContatto;