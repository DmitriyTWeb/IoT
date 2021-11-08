import React from "react";

const PumpState = ({pumpState}) => {
  const label = pumpState ? 'В РАБОТЕ' : 'ВЫКЛЮЧЕН';
  const classList = `pump-state__value ${pumpState ? "pump-state__value--on" : ""}`;

  return(
    <>
      <p className="pump-state__title">Статус включения насоса</p>
      <p className={classList}>{label}</p>
    </>
  );
};

export default PumpState;