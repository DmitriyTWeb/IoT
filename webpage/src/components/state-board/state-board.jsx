import React from "react";
import { connect } from "react-redux"
import FloorTemp from "../floor-temp/floor-temp";
import SensorStatus from "../sensor-status/sensor-status";
import { changeStoreState } from "../../store/action";

const StateBoard = (props) => {
  return(
    <>
      <FloorTemp />
      <SensorStatus />
      {/* <input type="button" onClick={props.changeStore} value="change store state"/> */}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  changeStore() {
    dispatch(changeStoreState());
  }
});

export {StateBoard};
export default connect(null, mapDispatchToProps)(StateBoard);
