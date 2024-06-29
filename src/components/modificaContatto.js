import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import comuniFile from "../files/comuni.csv";
import bgImg1 from "../images/bgImg1.png";

function ModificaContatto({
  vettoreContatti,
  onUpdateContatto,
  selectedContacts,
  updateSelectedContacts,
  handleCheckboxChange,
  readCsvFile, // Prop for reading CSV file
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    nascita: "",
    email: "",
    telefono: "",
    comune: "",
    indirizzo: "",
    image: "",
  });
  const [comuni, setComuni] = useState([]);
  const [telefono, setTelefono] = useState("");
  const handleGoHome = () => {
    navigate("/"); // Redirect to PrimaPagina
  };

  useEffect(() => {
    const loadComuni = async () => {
      try {
        const data = await readCsvFile(comuniFile);
        setComuni(data);
      } catch (error) {
        console.error("Error loading comuni:", error);
        setComuni([]);
      }
    };

    loadComuni();
  }, [readCsvFile]);

  useEffect(() => {
    const contatto = vettoreContatti.find(
      (contatto) => contatto.id === parseInt(id, 10)
    );
    if (contatto) {
      setFormData({
        nome: contatto.nome,
        cognome: contatto.cognome,
        nascita: contatto.nascita || "",
        image: contatto.image || null,
        email: contatto.email,
        telefono: contatto.telefono ? contatto.telefono.slice(3) : "",
        comune: contatto.comune || "",
        indirizzo: contatto.indirizzo || "",
      });
      setTelefono(contatto.telefono ? contatto.telefono.slice(3) : "");
    }
  }, [vettoreContatti, id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setImageFile(files[0]);
    } else if (name === "telefono") {
      setTelefono(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullTelefono = telefono ? `+39${telefono}` : "";
    const finalTelefono = fullTelefono === "+39" ? "" : fullTelefono;

    const updatedContatto = {
      ...formData,
      telefono: finalTelefono,
      image: imageFile ? URL.createObjectURL(imageFile) : formData.image,
    };

    const submissionData = new FormData();
    Object.entries(updatedContatto).forEach(([key, value]) => {
      submissionData.append(key, value);
    });

  

    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    try {
      const response = await fetch(
        `http://localhost:8080/scuola/rubricaupdate/${id}`,
        {
          method: "PUT",
          body: submissionData,
        }
      );

      if (response.ok) {
        alert("Contatto aggiornato");
        onUpdateContatto(parseInt(id, 10), updatedContatto);
        navigateNextContact();
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

  const navigateNextContact = () => {
    const currentIndex = selectedContacts.findIndex(
      (contactId) => contactId === parseInt(id, 10)
    );

    if (currentIndex !== -1) {
      updateSelectedContacts((prevSelected) =>
        prevSelected.filter((contactId) => contactId !== parseInt(id, 10))
      );
    }

    if (currentIndex !== -1 && currentIndex < selectedContacts.length - 1) {
      const nextId = selectedContacts[currentIndex + 1];
      navigate(`/Modifica/${nextId}`);
      alert("Contatto aggiornato");
    } else {
      navigate("/");
    }
  };

  if (!formData.nome) {
    return <div>Loading...</div>;
  }
  const styles = {
    // textAlign: "center",
    //color: "white", #ffbd37
   // background: "#ffbd37",
    //background: "#ffc107",
   backgroundImage: `url(${bgImg1})`,
  backgroundSize: "cover",
   backgroundRepeat: "no-repeat",
   // backgroundPosition: "bottom",
    fontSize: "1rem",
    width: "100%",
    //  marginTop: "10%",
    minHeight: "100vh",
    borderRadius:"0px",
    border:"0px",
   // boxShadow: "20px 0 20px 0 rgba(93, 0, 0, 1)",
   // minWidth: "400px"
  };
  return (
    <div className="container"  style={styles} >
            <br></br>
            <br></br>
      <h3 style={{ textAlign: "center" }}>Modifica Contatto</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row">
          {Object.keys(formData).map((key) => (
            <div key={key} className="col-md-6 mb-3">
              <label htmlFor={`input-${key}`} className="form-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              {key === "image" ? (
                <input
                  onChange={handleChange}
                  type="file"
                  className="form-control"
                  id={`input-${key}`}
                  name={key}
                />
              ) : key === "comune" ? (
                <select
                  className="form-control"
                  id={`input-${key}`}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                >
                  <option value="">Seleziona Comune o lascia questa scelta</option>
                  {comuni.map((loc) => (
                    <option key={loc.comune} value={loc.comune}>
                      {loc.comune}
                    </option>
                  ))}
                </select>
              ) : key === "nascita" ? (
                <input
                  onChange={handleChange}
                  type="date"
                  className="form-control"
                  id={`input-${key}`}
                  name={key}
                  value={formData[key] || ""}
                  max={new Date().toISOString().split("T")[0]}
                />
              ) : key === "telefono" ? (
                <div className="input-group">
                  <span className="input-group-text">+39</span>
                  <input
                    type="text"
                    className="form-control"
                    id={`input-${key}`}
                    name={key}
                    pattern="[0-9]{10}" // Italian phone number, 10 digits
                    onChange={handleChange}
                    value={telefono}
                    placeholder="10 cifre"
                  />
                </div>
              ) : (
                <input
                  onChange={handleChange}
                  type={key==="email"?"email":"text"}
                  className="form-control"
                  id={`input-${key}`}
                  name={key}
                  value={formData[key]}
                  placeholder={formData[key]}
                  disabled={["nome", "cognome","email"].includes(key)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="row justify-content-center">
        <button type="submit" className="btn btn-dark my-4" style={{ width: "20%", marginRight: "10px" }}>
          Salva Modifiche
        </button>
        <button onClick={handleGoHome} className="btn btn-dark my-4" style={{ width: "20%" }}>
          Home
        </button>
      </div>
      </form>
    </div>
  );
}

export default ModificaContatto;


