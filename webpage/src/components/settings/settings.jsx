import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setDeviceSettings } from "../../store/api-action";
import { extend } from "../../utils";

const Mode = {
  IN: "IN",
  OUT: "OUT"
};
const TempInit = {
  IN: 25,
  OUT: 18,
  DELTA: 3,
}

const Settings = ({ setSettings, mode = Mode.IN, tempIn = TempInit.IN, tempOut = TempInit.OUT, tempDelta = TempInit.DELTA }) => {
  const [currentSettings, setCurrentSettings] = useState({mode, tempIn, tempOut, tempDelta});

  useEffect(() =>{
    const newState = extend(currentSettings, { mode, tempIn, tempOut, tempDelta });
    setCurrentSettings(newState);
  }, [mode, tempIn, tempOut, tempDelta]);

  const paramChangeHandler = (e) => {
    const inputName = e.target.getAttribute('name');
    const value = e.target.value;
    const newState = extend(currentSettings, { [inputName]: value });
    setCurrentSettings(newState);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setSettings({
      ...currentSettings
    });
  };

  return(
    <form onSubmit={submitHandler} className="settings">
      <h1 className="settings__title">Настройки системы</h1>
      <section className="settings__floor">
        <h1 className="settings__floor-title">Установки теплых полов в бане</h1>
        <p className="settings__row-title">Активный режим</p>
        <input className="settings__mode-switch" type="radio" name="mode" id="mode_in" value={Mode.IN} onChange={paramChangeHandler} checked={currentSettings.mode === Mode.IN} />
        <label className="settings__mode-label" htmlFor="mode_in">хозяин в бане</label>

        <input className="settings__mode-switch" type="radio" name="mode" id="mode_out" value={Mode.OUT} onChange={paramChangeHandler} checked={currentSettings.mode === Mode.OUT} />
        <label className="settings__mode-label settings__mode-label--out" htmlFor="mode_out">никого нет</label>

        <p className="settings__row-title">Cредняя температура</p>
        <input className="settings__temp settings__temp--in" type="number" name="tempIn" step="0.1" min="0" max="60" onChange={paramChangeHandler} value={currentSettings.tempIn} required />
        <input className="settings__temp settings__temp--out" type="number" name="tempOut" step="0.1" min="0" max="60" onChange={paramChangeHandler} value={currentSettings.tempOut} required />

        <p className="settings__row-title">Отклонение температуры</p>
        <input className="settings__temp-delta" name="tempDelta" type="number" step="0.1" min="0" max="30" onChange={paramChangeHandler}
          value={currentSettings.tempDelta} required />
      </section>

      <input className="button settings__submit" type="submit" value="СОХРАНИТЬ УСТАНОВКИ"/>
    </form>
  );
};

const mapStateToProps = (state) => ({
  mode: state.mode,
  tempIn: state.tempIn,
  tempOut: state.tempOut,
  tempDelta: state.tempDelta
});
const mapDispatchToProps = (dispatch) => ({
  setSettings(settings) {
    dispatch(setDeviceSettings(settings));
  }
});

export { Settings };
export default connect(mapStateToProps, mapDispatchToProps)(Settings);