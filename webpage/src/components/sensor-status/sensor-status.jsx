import React from "react";

const SensorStatus = ({sensorStatus}) => {
  console.log(sensorStatus);
  return(
    <p>Статус датчика: {sensorStatus}</p>
  );
};

export default SensorStatus;