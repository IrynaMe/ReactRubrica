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
    <div className="p-4">
      <h3>{props.title}</h3>

      <form onSubmit={handleSubmit}>
        {vettoreFormInfo.map((elem) => (
          <div key={elem} className="mb-3">
            <label htmlFor={`input-${elem}`} className="form-label">
              {elem}:
            </label>
            <input
              required
              type={elem === "image" ? "file" : "text"}
              className="form-control"
              id={`input-${elem}`}
              name={elem}
            />
          </div>
        ))}

        <button type="submit" className="btn btn-dark">
          Invia
        </button>
      </form>
    </div>
  );
}

export default AddContatto;