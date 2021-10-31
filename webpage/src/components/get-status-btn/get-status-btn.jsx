import React from "react";

const GetStatusBtn = (props) => {
  const clickHandler = () => {
    fetch('/get_total_status', {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => console.log('response data = ', data));
  };

  return(
    <input type="button" value={props.label} onClick={clickHandler} />
  );
};

export default GetStatusBtn;