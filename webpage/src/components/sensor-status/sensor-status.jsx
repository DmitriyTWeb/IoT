import React from "react";
import { connect } from "react-redux";

const SensorStatus = ({sensorStatus}) => {
  console.log(sensorStatus);
  return(
    <p>Статус датчика: {sensorStatus}</p>
  );
};

const mapStateToProps = (state) => ({
  sensorStatus: state.sensorStatus,
});

export { SensorStatus };
export default connect(mapStateToProps, null)(SensorStatus);