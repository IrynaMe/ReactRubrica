import React from "react";

function AddContatto(props) {
  const { vettoreFormInfo, onAddContatto } = props;

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
        console.log("Success:", result);
        // Optionally, handle success (e.g., navigate to another page or show a success message)
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