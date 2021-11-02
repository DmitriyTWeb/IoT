import React from "react";
import { connect } from "react-redux";

const FloorTemp = (props) => {
  return(
    <p className="floor-temp">Температура теплых полов в бане: {props.floorTemp}</p>
  );
};


const mapStateToProps = (state) => ({
  floorTemp: state.floorTemp,
});

export { FloorTemp };
export default connect(mapStateToProps, null)(FloorTemp);