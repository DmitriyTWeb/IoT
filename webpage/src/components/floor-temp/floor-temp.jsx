import React from "react";

const FloorTemp = ({ floorTemp}) => {
  let formattedTemp = Number.parseFloat(floorTemp).toFixed(1);
  formattedTemp = formattedTemp === 'NaN' ? '--' : formattedTemp;

  return(
    <>
      <p className="floor-temp__title">Температура теплых полов в бане</p>
      <p className="floor-temp__value">{formattedTemp}</p>
    </>
  );
};

export default React.memo(FloorTemp);