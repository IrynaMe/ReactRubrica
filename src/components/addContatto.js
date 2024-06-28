import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import comuniFile from "../files/comuni.csv";
import bgImg1 from "../images/bgImg1.png";

function AddContatto(props) {
  const { vettoreFormInfo, onAddContatto, readCsvFile } = props;
  const navigate = useNavigate();
  const [comuni, setComuni] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    image: null,
    email: "",
    telefono: "",
    comune: "",
    indirizzo: "",
    nascita: "", // This will hold the formatted date string
  });

  const [telefono, setTelefono] = useState("");
  const handleGoHome = () => {
    navigate("/"); // Redirect to PrimaPagina
  };


  useEffect(() => {
    const loadData = async () => {
      const data = await readCsvFile(comuniFile);
      setComuni(data);
    };
    loadData();
  }, [readCsvFile]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else if (name === "nascita") {
      const dateValue = new Date(value);
      const formattedDate = dateValue.toISOString();
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedDate,
      }));
    } else if (name === "telefono") {
      setTelefono(value);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();

    // Check if the phone number is just the prefix +39
    const fullTelefono = telefono ? `+39${telefono}` : "";
    const finalTelefono = fullTelefono === "+39" ? "" : fullTelefono;

    Object.entries({
      ...formData,
      telefono: finalTelefono,
      abilitato: "1", // Default value for abilitato
    }).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await fetch("http://localhost:8080/scuola/rubricainsert", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Contatto aggiunto");
        navigate("/"); // Navigate to home page if no more contacts to navigate
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const styles = {
    // textAlign: "center",
    //color: "white", #ffbd37
   // background: "#ffbd37",
    //background: "#ffc107",
   //backgroundImage: `url(${bgImg1})`,
    //backgroundSize: "cover",
   // backgroundRepeat: "no-repeat",
   // backgroundPosition: "bottom",
    fontSize: "1rem",
    width: "100%",
    //  marginTop: "10%",
    height: "100vh",
    borderRadius:"0px",
    border:"0px",
   // boxShadow: "20px 0 20px 0 rgba(93, 0, 0, 1)",
   // minWidth: "400px"
  };
  return (
    <div className="container mt-5" >
      <h3 className="  " style={{ textAlign: "center" }}>{props.title}</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row">
          {vettoreFormInfo.map((elem) => (
            <div key={elem} className="col-md-6 mb-3">
              <label htmlFor={`input-${elem}`} className="form-label">
                {elem.charAt(0).toUpperCase() + elem.slice(1)}:
                {["nome", "cognome", "email"].includes(elem) && (
                  <span style={{ color: "red" }}>*</span>
                )}
              </label>
              {elem === "comune" ? (
                <select
                  className="form-control"
                  id={`input-${elem}`}
                  name={elem}
                  onChange={handleChange}
                  value={formData[elem]}
                >
                  <option key="default" value="">
                    Seleziona Comune o lascia questa scelta
                  </option>
                  {comuni.map((loc, index) => (
                    <option key={`${loc.comune}-${index}`} value={loc.comune}>
                      {loc.comune}
                    </option>
                  ))}
                </select>
              ) : elem === "image" ? (
                <input
                  type="file"
                  className="form-control"
                  id={`input-${elem}`}
                  name={elem}
                  onChange={handleChange}
                />
              ) : elem === "nascita" ? (
                <input
                  type="date"
                  className="form-control"
                  id={`input-${elem}`}
                  name={elem}
                  max={new Date().toISOString().split("T")[0]} // Set max date to today
                  onChange={handleChange}
                  value={formData[elem] || ""}
                />
              )  : elem === "telefono" ? (
                <div className="input-group">
                  <span className="input-group-text">+39</span>
                  <input
                    type="text"
                    className="form-control"
                    id={`input-${elem}`}
                    name={elem}
                    pattern="[0-9]{10}" // Italian phone number, 10 digits
                    onChange={handleChange}
                    value={telefono}
                    placeholder="10 cifre"
                  />
                </div>
              ) : (
                <input
                  type={elem === "email" ? "email" : "text"}
                  className="form-control"
                  id={`input-${elem}`}
                  name={elem}
                  placeholder={(elem === "nome" || elem === "cognome") ? "min 2 caratteri" : undefined }
                  minLength={["nome", "cognome"].includes(elem) ? 2 : undefined}
                  required={["nome", "cognome", "email"].includes(elem)}
                  onChange={handleChange}
                  value={formData[elem]}
                />
              )}
            </div>
          ))}
        </div>
        <p style={{ fontStyle: "italic", color: "gray" }}>
          I campi contrassegnati con "*" sono obbligatori
        </p>
        <div className="row justify-content-center">
        <button type="submit" className="btn btn-dark my-4" style={{ width: "20%", marginRight: "10px" }}>
          Salva contatto
        </button>
        <button onClick={handleGoHome} className="btn btn-dark my-4" style={{ width: "20%" }}>
          Home
        </button>
      </div>
    </form>
  </div>
);
}

export default AddContatto;


