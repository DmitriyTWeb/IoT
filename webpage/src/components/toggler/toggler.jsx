import React from "react";

const Toggler = (props) => {
  const clickHandler = () => {
    fetch('/toggle_test_led')
      .then(response => console.log(response.body));;
  };

  return(
    <input type="button" value={props.label} onClick={clickHandler}/>
  );
};

export default Toggler;