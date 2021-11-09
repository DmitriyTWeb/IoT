import React, { useEffect } from "react";
import { connect } from "react-redux"
import FloorTemp from "../floor-temp/floor-temp";
import SensorStatus from "../sensor-status/sensor-status";
import PumpState from "../pump-state/pump-state";
import { getDeviceState } from "../../store/api-action";

const StateBoard = (props) => {
  useEffect(() => {
    setInterval(() => {
      props.loadDeviceState();
    }, 2000);

  }, []);

  return(
    <section className="state">
      <h1 className="state-title">Состояние системы</h1>
      <FloorTemp floorTemp={props.currentTemp} />
      <SensorStatus sensorStatus={props.sensorStatus} />
      <PumpState pumpState={props.pumpState}/>
    </section>
  );
};

const mapStateToProps = (state) => ({
  pumpState: state.pumpState,
  sensorStatus: state.sensorStatus,
  currentTemp: state.currentTemp,
});

const mapDispatchToProps = (dispatch) => ({
  changeStore() {
    dispatch(changeStoreState());
  },
  loadDeviceState() {
    dispatch(getDeviceState());
  }
});

export {StateBoard};
export default connect(mapStateToProps, mapDispatchToProps)(StateBoard);