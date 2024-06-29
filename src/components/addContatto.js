import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import comuniFile from "../files/comuni.csv";
import bgImg1 from "../images/bgImg1.png";

function AddContatto(props) {
  const { vettoreFormInfo, onAddContatto, readCsvFile, vettoreContatti, title } = props;
  const navigate = useNavigate();
  const [comuni, setComuni] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    image: null,
    email: "",
    telefono: "",
    comune: "",
    indirizzo: "",
    nascita: "",
  });

  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const data = await readCsvFile(comuniFile);
      const sortedComuni = data.sort((a, b) => a.comune.localeCompare(b.comune));
      setComuni(sortedComuni);
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
    event.preventDefault(); // Ensure this line is correct and 'event' is properly passed
  
    const emailExists = vettoreContatti.some((contact) => contact.email === formData.email);
    if (emailExists) {
      setError("Email già in uso, inserisci un'altra email.");
      return;
    }
  
    const formDataToSend = new FormData();
    const fullTelefono = telefono ? `+39${telefono}` : "";
    const finalTelefono = fullTelefono === "+39" ? "" : fullTelefono;
  
    Object.entries({
      ...formData,
      telefono: finalTelefono,
      abilitato: "1",
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
        onAddContatto(result);
        navigate("/");
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const handleGoHome = () => {
    navigate("/");
  };

  const styles = {
    backgroundImage: `url(${bgImg1})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    fontSize: "1rem",
    width: "100%",
    minHeight: "100vh",
    borderRadius: "0px",
    border: "0px",
  };

  return (
    <div className="container" style={styles}>
      <br />
      <br />
      <h3 style={{ textAlign: "center" }}>{title}</h3>
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
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  value={formData[elem] || ""}
                />
              ) : elem === "telefono" ? (
                <div className="input-group">
                  <span className="input-group-text">+39</span>
                  <input
                    type="text"
                    className="form-control"
                    id={`input-${elem}`}
                    name={elem}
                    pattern="[0-9]{10}"
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
                  placeholder={["nome", "cognome"].includes(elem) ? "min 2 caratteri" : undefined}
                  minLength={["nome", "cognome"].includes(elem) ? 2 : undefined}
                  required={["nome", "cognome", "email"].includes(elem)}
                  onChange={handleChange}
                  value={formData[elem]}
                />
              )}
              {elem === "email" && error && (
                <p style={{ color: "red", marginTop: "5px" }}>{error}</p>
              )}
            </div>
          ))}
        </div>
        <p style={{ fontStyle: "italic", color: "red" }}>
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
