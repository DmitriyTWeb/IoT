import React from "react";
import { connect } from "react-redux"
import FloorTemp from "../floor-temp/floor-temp";
import SensorStatus from "../sensor-status/sensor-status";
import PumpState from "../pump-state/pump-state";
import { getDeviceStateSelect } from "../../store/selectors/selectors";
import { DeviceState } from "../../store/reducers/state-reducer";

const StateBoard = ({ DeviceStatee }: {DeviceStatee: DeviceState}) => {
  const { currentTemp, sensorStatus, pumpState } = DeviceStatee;
  return(
    <section className="state">
      <h1 className="state-title">Состояние системы</h1>
      <FloorTemp floorTemp={currentTemp} />
      <SensorStatus sensorStatus={sensorStatus} />
      <PumpState pumpState={pumpState}/>
    </section>
  );
};

const mapStateToProps = (state: DeviceState) => ({
  DeviceStatee: getDeviceStateSelect(state),
});

export {StateBoard};
export default connect(mapStateToProps, null)(StateBoard);