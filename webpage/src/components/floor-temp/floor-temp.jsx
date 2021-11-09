import React from "react";

const FloorTemp = ({ floorTemp }) => {
  const formattedTemp = Number.parseFloat(floorTemp).toFixed(1)

  return(
    <>
      <p className="floor-temp__title">Температура теплых полов в бане</p>
      <p className="floor-temp__value">{formattedTemp}</p>
    </>
  );
};

export default FloorTemp;