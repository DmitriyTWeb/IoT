import React from "react";

const SensorStatus = ({sensorStatus}) => {
  console.log(sensorStatus);
  return(
    <>
      <p className="sensor-status__title">Статус датчика</p>
      <p className="sensor-status__value">{sensorStatus}</p>
    </>

  );
};

export default SensorStatus;