import React from "react";

const SensorStatus = ({sensorStatus}) => {
  let label = '--';
  if (sensorStatus === 'SENSOR_BROKEN') {
    label = 'ОБРЫВ';
  } else if (sensorStatus === 'SENSOR_WORK') {
    label = 'В НОРМЕ';
  }

  const classList = `bg-gray-200 text-center px-4 py-2.5 rounded-md ${sensorStatus === 'SENSOR_BROKEN' ? "bg-red-400" : ""}`;
  return(
    <>
      <p className="flex items-center mr-4 md:mr-5">Статус датчика</p>
      <p className={classList}>{label}</p>
    </>

  );
};

export default React.memo(SensorStatus);