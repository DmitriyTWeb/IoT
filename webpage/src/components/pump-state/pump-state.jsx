import React from "react";

const PumpState = ({pumpState}) => {
  return(
    <>
      <p className="pump-stat__title">Статус включения насоса</p>
      <p className="pump-stat__value">{pumpState}</p>
    </>
  );
};

export default PumpState;