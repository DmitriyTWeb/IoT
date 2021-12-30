import React from "react";

const Toggler = (props) => {
  const clickHandler = () => {
    fetch('/toggle_test_led')
      .then(response => console.log(response.body));;
  };

  return(
    <input type="button" className="border p-2 bg-gray-200 mb-2" value={props.label} onClick={clickHandler}/>
  );
};

export default Toggler;