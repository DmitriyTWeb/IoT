import React from "react";

const FloorTemp = (props) => {
  return(
    <p className="floor-temp">Температура теплых полов в бане: {props.floorTemp}</p>
  );
};



export default FloorTemp;