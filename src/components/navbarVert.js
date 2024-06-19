import React from "react";
import { Link } from "react-router-dom";

function NavbarVert(props) {
  const { vettoreContatti } = props;

  return (
    <nav className="bg-warning px-2 py-4" style={{ height: "100vh" }}>
      <Link className="nav-link" to={`/AddContatto`}>
        <button className="btn btn-dark">Aggiungi contatto</button>
      </Link>
      <h4
        style={{ margin: "15px" }}
        //  style={{ textAlign:'center' }}
      >
        {props.title}
      </h4>

      <ul className="nav flex-column ">
      {vettoreContatti.map((elemento) => (
          <li className="nav-item" key={elemento.id}>
            <Link
              className="nav-link text-dark"
              to={`/VisualizzaContatto/${elemento.id}`}
            >
              {Object.values(elemento)
              // Exclude arr values 0,3,4-visualize only nome cognome
                .filter((value, index) => index !== 0&&index!==3&&index!==4) 
                .join(' ')}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavbarVert;
