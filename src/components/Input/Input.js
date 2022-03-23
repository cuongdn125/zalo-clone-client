import React from "react";
import "./Input.scss";
function Input({ type, placeholder, value, onChange }) {
  return (
    <div className="input-container">
      <input
        className="input"
        type={type ? type : "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // autocomplete="off"
        required
      />
      {/* <div className="input-status" /> */}
    </div>
  );
}

export default Input;
