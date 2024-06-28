import React from 'react';
import bgImg from "../images/background1.png";

function PrimaPagina(props) {

  const styles = {
    // textAlign: "center",
    //color: "white",
    //background: "#ffc107",
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
     fontSize: "40px",
    width: "96%",
    //  marginTop: "10%",
    height: "100vh",
  };
  return (
    
    <div className="p-4" style={styles}>
      <h3>{props.title}</h3>
  
    </div>
  );
}

export default PrimaPagina;