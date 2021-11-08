import React from "react";

const SensorStatus = ({sensorStatus}) => {
  const isBroken = sensorStatus === 'SENSOR_BROKEN'
  const label =  isBroken ? 'ОБРЫВ' : 'В НОРМЕ';
  const classList = `sensor-status__value ${isBroken ? "sensor-status__value--broken" : ""}`;

  return(
    <>
      <p className="sensor-status__title">Статус датчика</p>
      <p className={classList}>{label}</p>
    </>

  );
};

export default SensorStatus;