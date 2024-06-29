import React from 'react';
import bgImg from "../images/bgImg1.png";

function PrimaPagina(props) {

  const styles = {
    // textAlign: "center",
    //color: "white",
    //background: "#ffc107",
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
     fontSize: "40px",
    width: "100%",
    //  marginTop: "10%",
    minHeight: "100vh",
  };
  return (
    
    <div className="container" style={styles} >
            <br></br>
            
      <h3 style={{textAlign:"center"}}>{props.title}</h3>
  
    </div>
  );
}

export default PrimaPagina;