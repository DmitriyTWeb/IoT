import React, { useState } from "react";

const Mode = {
  IN: "IN",
  OUT: "OUT"
};
const TempInit = {
  IN: 25,
  OUT: 18,
  DELTA: 3,
}

const SettingsForm = (props) => {
  // const [settings, setSettings] = useState({});

  const [mode, setMode] = useState(Mode.OUT);
  const [tempIn, setTempIn] = useState(TempInit.IN);
  const [tempOut, setTempOut] = useState(TempInit.OUT);
  const [tempDelta, setTempDelta] = useState(TempInit.DELTA);

  const modeChangeHandler = (e) => {
    setMode(e.target.value);
  };
  const tempInChangeHandler = (e) => {
    setTempIn(e.target.value);
  };
  const tempOutChangeHandler = (e) => {
    setTempOut(e.target.value);
  };
  const tempDeltaChangeHandler = (e) => {
    setTempDelta(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    fetch('/set_settings', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "mode": mode,
        "tempIn": tempIn,
        "tempOut": tempOut,
        "tempDelta": tempDelta,
      })
    })
      .then(response => response.json())
      .then(data => console.log('response data = ', data))
      .catch(err => console.log(err));
  };

  return(
    <form onSubmit={submitHandler}>
      <label>
        Режим "хозяин в бане":
        <input type="radio" name="mode" id="chetyre1" value={Mode.IN} onChange={modeChangeHandler} checked={mode === Mode.IN}/>
      </label>
      <label>
        Режим "Никого нет":
        <input type="radio" name="mode" id="chetyre2" value={Mode.OUT} onChange={modeChangeHandler} checked={mode === Mode.OUT}/>
      </label>
       <div>
        <label>Установка средней температуры теплых полов - Режим "Хозяин в бане":</label>
        <input type="number" step="0.1" min="0" max="60" onChange={tempInChangeHandler} value={tempIn} required />
      </div>
      <div>
        <label>Установка средней температуры теплых полов - Режим "Никого нет": </label>
        <input type="number" step="0.1" name="threshold_input2" min="0" max="60" onChange={tempOutChangeHandler} value={tempOut} required />
      </div>
      <div>
        <label>Отклонение температуры теплых полов в бане: </label>
        <input type="number" step="0.1" min="0" max="30" onChange={tempDeltaChangeHandler} value={tempDelta} required />
      </div>
      <input type="submit" value="СОХРАНИТЬ УСТАНОВКИ"/>
    </form>
  );
};

export default SettingsForm;