import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ModificaContatto({ vettoreContatti, onUpdateContatto, selectedContacts, updateSelectedContacts,  handleCheckboxChange}) {
  
  const { id } = useParams(); // Assuming you're passing single ID as parameter
  const navigate = useNavigate();

  // Find the contact based on the ID
  const contatto = vettoreContatti.find((contatto) => contatto.id === parseInt(id, 10));

  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    image: "",
    email: "",
    telefono: "",
  });

  // Separate state for file input
  const [imageFile, setImageFile] = useState(null);

  // Effect to update formData when contatto changes
  useEffect(() => {
    if (contatto) {
      setFormData({
        nome: contatto.nome,
        cognome: contatto.cognome,
        image: contatto.image,
        email: contatto.email,
        telefono: contatto.telefono || "",
      });
    }
  }, [contatto]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setImageFile(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedContatto = {
      ...formData,
      image: imageFile ? URL.createObjectURL(imageFile) : formData.image,
    };

    try {
      const response = await fetch(`http://localhost:8080/scuola/rubricaupdate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContatto),
      });

      if (response.ok) {
        alert("Contatto aggiornato");

        // Call the onUpdateContatto function to update state in parent component
        onUpdateContatto(parseInt(id, 10), updatedContatto);

        // Optionally, navigate to the next contact if available
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

// Function to navigate to the next contact
const navigateNextContact = () => {
  const currentIndex = selectedContacts.findIndex((contactId) => contactId === parseInt(id, 10));
  
  // Remove the updated contact from the selectedContacts array
  if (currentIndex !== -1) {
    updateSelectedContacts((prevSelected) =>
      prevSelected.filter((contactId) => contactId !== parseInt(id, 10))
    );
  }

  if (currentIndex !== -1 && currentIndex < selectedContacts.length - 1) {
    const nextId = selectedContacts[currentIndex + 1];
    navigate(`/Modifica/${nextId}`);
    // Optionally handle state update or feedback after bulk update
    alert("Contatto aggiornato");
  } else {
    navigate("/"); // Navigate to home page if no more contacts to navigate
  }
};


  if (!contatto) {
    return <div>Loading...</div>; // Add a loading indicator while contatto is being fetched
  }

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
                disabled={key !== "image" && key !== "email" && key !== "telefono"}
              />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-dark">
          Salva Modifiche
        </button>
      </form>
    </div>
  );
}

export default ModificaContatto;