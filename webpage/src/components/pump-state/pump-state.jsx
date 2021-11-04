import React from "react";

const PumpState = (props) => {
  return(
    <p>Статус включения насоса: {props.pumpState}</p>
  );
};

export default PumpState;