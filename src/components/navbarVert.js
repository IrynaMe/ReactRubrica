

import { Link, useNavigate } from "react-router-dom";

function NavbarVert({ vettoreContatti, title, onBulkDelete, handleCheckboxChange,selectedContacts, setSelectedContacts }) {

  const navigate = useNavigate();
  
 
  
  const handleBulkDelete = async () => {
    try {
      const response = await fetch("http://localhost:8080/scuola/rubricadelete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedContacts),
      });
      if (response.ok) {
       
        onBulkDelete(selectedContacts);
        selectedContacts.length>1? alert("Selezionati contatti eliminati"):(selectedContacts.length===1?
          alert("Selezionato contatto eliminato"):alert("Non ci sono contatti selezionati"));
        setSelectedContacts([]);
        
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

const handleBulkUpdate = () => {
  if (selectedContacts.length > 0) {
    navigate(`/Modifica/${selectedContacts[0]}`);
  } else {
    alert("Non ci sono contatti selezionati");
  }
};



  return (
    <nav className=" px-2 py-4" style={{ height: "100vh", background:"#ffbd37" }}>
      <h4 style={{ margin: "15px" }}>{title}</h4>
      <ul className="nav flex-column" >
        {vettoreContatti
          .filter((elemento) => elemento.stato === 1)
          .map((elemento) => (
            <li className="nav-item d-flex align-items-center" key={elemento.id}>
              <input
                type="checkbox"
                checked={selectedContacts.includes(elemento.id)}
                onChange={() => handleCheckboxChange(elemento.id)}
                className="mr-2"
              />
              <Link className="nav-link text-dark" to={`/VisualizzaContatto/${elemento.id}`}>
                {`${elemento.nome} ${elemento.cognome}`}
              </Link>
            </li>
          ))}
      </ul>

      <button className="btn btn-dark mt-3 w-100" onClick={handleBulkDelete}>
        Elimina selezionati
      </button>
      <br />
      <button className="btn btn-dark mt-3 w-100" onClick={handleBulkUpdate}>
        Modifica selezionati
      </button>
      <br />
      <Link className="nav-link" to={`/addContatto`}>
        <button className="btn btn-dark mt-3 w-100">Aggiungi nuovo contatto</button>
      </Link>
    </nav>
  );
}

export default NavbarVert;