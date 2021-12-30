import React, { FC } from "react";
import { connect } from "react-redux"
import FloorTemp from "../floor-temp/floor-temp";
import SensorStatus from "../sensor-status/sensor-status";
import PumpState from "../pump-state/pump-state";
import { getDeviceStateSelect } from "../../store/selectors/selectors";
import { DeviceStateProps } from "../../store/reducers/state-reducer";

const StateBoard: FC<DeviceStateProps> = ({ currentTemp, sensorStatus, pumpState }) => {
  return(
    <section className="relative grid grid-cols-[2fr_1fr] mt-20 xl:mt-30 p-4 border border-dashed rounded-2xl state">
      <h1 className="state-title">Состояние системы</h1>
      <FloorTemp floorTemp={currentTemp} />
      <SensorStatus sensorStatus={sensorStatus} />
      <PumpState pumpState={pumpState}/>
    </section>
  );
};

const mapStateToProps = (state: DeviceStateProps) => ({
  DeviceState: getDeviceStateSelect(state),
});

export {StateBoard};
export default connect(mapStateToProps, null)(StateBoard);