import React from "react";

function AddContatto(props) {
  const { vettoreFormInfo, onAddContatto } = props;

  return (
    <div className="p-4">
      <h3>{props.title}</h3>

      <form onSubmit={onAddContatto}>
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
              name={elem} // Use 'name' attribute to identify input fields
            />
          </div>
        ))}
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Check me out
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddContatto;

