import React from "react";

const PumpState = ({pumpState}) => {
  let label = '--';
  if (pumpState == 0) {
    label = 'ВЫКЛЮЧЕН';
  } else if (pumpState == 1) {
    label = 'В РАБОТЕ';
  }

  const classList = `pump-state__value ${pumpState ? 'pump-state__value--on' : ''}`;
  return(
    <>
      <p className="pump-state__title">Статус включения насоса</p>
      <p className={classList}>{label}</p>
    </>
  );
};

export default React.memo(PumpState);