import React from "react";

const Toggler = (props) => {
  const clickHandler = () => {
    fetch('/relay_switch')
      .then(response => console.log(response.body));;
  };

  return(
    <input type="button" value={props.label} onClick={clickHandler}/>
  );
};

export default Toggler;