import React, { FC } from "react";
import { connect } from "react-redux"
import FloorTemp from "../floor-temp/floor-temp";
import SensorStatus from "../sensor-status/sensor-status";
import PumpState from "../pump-state/pump-state";
import { getDeviceStateSelect } from "../../store/selectors/selectors";
import { DeviceStateProps } from "../../store/reducers/state-reducer";

const StateBoard: FC<DeviceStateProps> = ({ currentTemp, sensorStatus, pumpState }) => {
  return(
    <section className="relative grid grid-cols-[2fr_1fr] mt-20 xl:mt-30 mb-8 md:mb-12 p-4 border border-dashed border-slate-600 rounded-md gap-y-2 md:gap-y-4">
      <h1 className="absolute bg-white -top-4 left-4 px-2 text-lg text-slate-500">Состояние системы</h1>
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