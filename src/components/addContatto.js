import React from "react";
import { useNavigate } from "react-router-dom";

function AddContatto(props) {
  const { vettoreFormInfo, onAddContatto } = props;
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    formData.append("stato", formData.get("stato"));

    try {
      const response = await fetch("http://localhost:8080/scuola/rubricainsert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Contatto aggiunto");
        navigate("/"); // Navigate to home page if no more contacts to navigate
      } else {
        console.error("Error:", response.statusText);
        // Optionally, handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error:", error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  return (
    <div className="container mt-5">
      <h3 style={{ textAlign: "center" }}>{props.title}</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row">
          {vettoreFormInfo.map((elem, index) => (
            <div key={elem} className="col-md-6 mb-3">
              <label htmlFor={`input-${elem}`} className="form-label">
                {elem.charAt(0).toUpperCase() + elem.slice(1)}:
                {["nome", "cognome", "email"].includes(elem) && (
                  <span style={{ color: "red" }}>*</span>
                )}
              </label>
              <input
                required={["nome", "cognome", "email"].includes(elem)}
                type={elem === "image" ? "file" : elem === "nascita" ? "date" : "text"}
                className="form-control"
                id={`input-${elem}`}
                name={elem}
                pattern={elem === "email" ? "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" : undefined}
                title={elem === "email" ? "Inserisci un indirizzo email valido" : undefined}
              />
            </div>
          ))}
        </div>
        <p style={{ fontStyle: "italic", color: "gray" }}>
          I campi contrassegnati con "*" sono obbligatori.
        </p>
        <button type="submit" className="btn btn-dark my-4">
          Invia
        </button>
      </form>
    </div>
  );
}

export default AddContatto;