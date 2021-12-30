import React from "react";

const FloorTemp = ({ floorTemp }) => {
  let formattedTemp = Number.parseFloat(floorTemp).toFixed(1);
  formattedTemp = formattedTemp === 'NaN' ? '--' : formattedTemp;

  return(
    <>
      <p className="flex items-center mr-4 md:mr-5">Температура теплых полов в бане</p>
      <p className="bg-gray-200 text-center px-4 py-2.5 rounded-md">{formattedTemp}</p>
    </>
  );
};

export default React.memo(FloorTemp);