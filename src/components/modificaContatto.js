import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ModificaContatto({ vettoreContatti, onUpdateContatto }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const contatto = vettoreContatti.find((contatto) => contatto.id === parseInt(id, 10));

  const [formData, setFormData] = useState({
    nome: contatto.nome,
    cognome: contatto.cognome,
    image: contatto.image,
    email: contatto.email,
    telefono: contatto.telefono || "", // Ensure telefono is defined or default to empty string
  });

  // Separate state for file input
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      // Handle file input separately
      setImageFile(files[0]);
    } else {
      // Handle other inputs
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare updated contact object
    const updatedContatto = {
      ...formData,
      image: imageFile ? URL.createObjectURL(imageFile) : formData.image, // Use file object or existing URL
    };

    onUpdateContatto(parseInt(id, 10), updatedContatto);
    navigate("/");  // Redirect to PrimaPagina
  };

  return (
    <div className="container mt-5">
      <h3>Modifica Contatto</h3>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-3">
            <label htmlFor={`input-${key}`} className="form-label">
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            {key === "image" ? (
              <input
                onChange={handleChange}
                type="file"
                className="form-control"
                id={`input-${key}`}
                name={key}
              />
            ) : (
              <input
                onChange={handleChange}
                type="text"
                className="form-control"
                id={`input-${key}`}
                name={key}
                value={formData[key]}
                placeholder={formData[key]}
                required
              />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-dark">Salva Modifiche</button>
      </form>
    </div>
  );
}

export default ModificaContatto;



  {/*       <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-control"
          />
        </div> */}