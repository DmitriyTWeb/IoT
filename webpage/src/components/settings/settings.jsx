import React, { useState } from "react";
import { connect } from "react-redux";
import { setDeviceSettings } from "../../store/api-action";

const Mode = {
  IN: "IN",
  OUT: "OUT"
};
const TempInit = {
  IN: 25,
  OUT: 18,
  DELTA: 3,
}

const Settings = ({ setSettings }) => {
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
    setSettings({
      mode,
      tempIn,
      tempOut,
      tempDelta,
    });
  };

  return(
    <form onSubmit={submitHandler} className="settings">
      <h1 className="settings__title">Настройки системы</h1>
      <section className="settings__floor">
        <h1 className="settings__floor-title">Установки теплых полов в бане</h1>
        <p className="settings__row-title">Активный режим</p>
        <input className="settings__mode-switch" type="radio" name="mode" id="mode_in" value={Mode.IN} onChange={modeChangeHandler} checked={mode === Mode.IN} />
        <label className="settings__mode-label" htmlFor="mode_in">хозяин в бане</label>

        <input className="settings__mode-switch" type="radio" name="mode" id="mode_out" value={Mode.OUT} onChange={modeChangeHandler} checked={mode === Mode.OUT} />
        <label className="settings__mode-label settings__mode-label--out" htmlFor="mode_out">никого нет</label>

        <p className="settings__row-title">Cредняя температура</p>
        <input className="settings__temp settings__temp--in" type="number" step="0.1" min="0" max="60" onChange={tempInChangeHandler} value={tempIn} required />
        <input className="settings__temp settings__temp--out" type="number" step="0.1" name="threshold_input2" min="0" max="60" onChange={tempOutChangeHandler} value={tempOut} required />

        <p className="settings__row-title">Отклонение температуры</p>
        <input className="settings__temp-delta" type="number" step="0.1" min="0" max="30" onChange={tempDeltaChangeHandler} value={tempDelta} required />
      </section>

      <input className="button settings__submit" type="submit" value="СОХРАНИТЬ УСТАНОВКИ"/>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setSettings(settings) {
    dispatch(setDeviceSettings(settings));
  }
});

export { Settings };
export default connect(null, mapDispatchToProps)(Settings);