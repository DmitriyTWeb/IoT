import React from "react";

const SetStatusBtn = (props) => {
  const clickHandler = () => {
    fetch('/set_total_status', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "threshInBath": "99",
        "threshOutOfBath": "10",
        "tempDelta": "3"
      })
    })
      .then(response => response.json())
      .then(data => console.log('response data = ', data));
  };

  return (
    <input type="button" value={props.label} onClick={clickHandler} />
  );
};

export default SetStatusBtn;