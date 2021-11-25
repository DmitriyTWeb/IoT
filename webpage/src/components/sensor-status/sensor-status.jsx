import React from "react";

const SensorStatus = ({sensorStatus}) => {
  let label = '--';
  if (sensorStatus === 'SENSOR_BROKEN') {
    label = 'ОБРЫВ';
  } else if (sensorStatus === 'SENSOR_WORK') {
    label = 'В НОРМЕ';
  }

  const classList = `sensor-status__value ${sensorStatus === 'SENSOR_BROKEN' ? "sensor-status__value--broken" : ""}`;
  return(
    <>
      <p className="sensor-status__title">Статус датчика</p>
      <p className={classList}>{label}</p>
    </>

  );
};

export default React.memo(SensorStatus);