import React from "react";
import { connect } from "react-redux";
import { updateDeviceState } from "../../store/action";

const GetStateBtn = (props) => {
  return(
    <input type="button" value={props.label} onClick={props.clickHandler} />
  );
};

const mapDispatchToProps = (dispatch) => ({
  clickHandler() {
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
export {GetStateBtn};
export default connect(null, mapDispatchToProps)(GetStateBtn);