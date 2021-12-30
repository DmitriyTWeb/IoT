import React from "react";

const PumpState = ({pumpState}) => {
  let label = '--';
  if (pumpState == 0) {
    label = 'ВЫКЛЮЧЕН';
  } else if (pumpState == 1) {
    label = 'В РАБОТЕ';
  }

  const classList = `bg-gray-200 text-center px-4 py-2.5 rounded-md ${pumpState ? 'bg-green-300' : ''}`;
  return(
    <>
      <p className="flex items-center mr-4 md:mr-5">Статус включения насоса</p>
      <p className={classList}>{label}</p>
    </>
  );
};

export default React.memo(PumpState);