import React from "react";

const FloorTemp = (props) => {
  return(
    <>
      <p className="floor-temp__title">Температура теплых полов в бане</p>
      <p className="floor-temp__value">{props.floorTemp}</p>
    </>
  );
};



export default FloorTemp;