import React, { useEffect } from "react";
import { connect } from "react-redux"
import FloorTemp from "../floor-temp/floor-temp";
import SensorStatus from "../sensor-status/sensor-status";
import PumpState from "../pump-state/pump-state";

const StateBoard = ({ currentTemp, sensorStatus, pumpState }) => {
  return(
    <section className="state">
      <h1 className="state-title">Состояние системы</h1>
      <FloorTemp floorTemp={currentTemp} />
      <SensorStatus sensorStatus={sensorStatus} />
      <PumpState pumpState={pumpState}/>
    </section>
  );
};

const mapStateToProps = (state) => ({
  pumpState: state.pumpState,
  sensorStatus: state.sensorStatus,
  currentTemp: state.currentTemp,
});

export {StateBoard};
export default connect(mapStateToProps, null)(StateBoard);