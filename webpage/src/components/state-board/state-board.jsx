import React, { useEffect } from "react";
import { connect } from "react-redux"
import FloorTemp from "../floor-temp/floor-temp";
import SensorStatus from "../sensor-status/sensor-status";
import PumpState from "../pump-state/pump-state";
import { updateDeviceState } from "../../store/action";

const StateBoard = (props) => {
  useEffect(() => {
    setInterval(() => {
      props.fetchDeviceState();
    }, 2000);

  }, []);

  return(
    <>
      <FloorTemp floorTemp={props.currentTemp} />
      <SensorStatus sensorStatus={props.sensorStatus} />
      <PumpState pumpState={props.pumpState}/>
    </>
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
  fetchDeviceState() {
    fetch('/get_device_state', {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        dispatch(updateDeviceState(data));
        console.log('response data = ', data)
      });
  }
});

export {StateBoard};
export default connect(mapStateToProps, mapDispatchToProps)(StateBoard);