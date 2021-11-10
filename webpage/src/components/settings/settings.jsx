import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setDeviceSettings } from "../../store/api-action";
import { extend } from "../../utils";

const Mode = {
  IN: "IN",
  OUT: "OUT"
};
const Init = {
  mode: '--',
  tempIn: -99,
  tempOut: -99,
  tempDelta: -99,
}

const Settings = ({ setSettings, mode = Init.mode, tempIn = Init.tempIn, tempOut = Init.tempOut, tempDelta = Init.tempDelta }) => {
  const [currentSettings, setCurrentSettings] = useState({mode, tempIn, tempOut, tempDelta});
  const [edit, setEdit] = useState(false);

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

    if (!edit) {
      setEdit(true);
      return;
    }
    if (edit) {
      setSettings({ ...currentSettings });
      setEdit(false);
    }
  }

  return(
    <form onSubmit={submitHandler} className="settings">
      <h1 className="settings__title">Настройки системы</h1>

      <section className="settings__floor">
        <div className={`settings__curtain ${!edit && 'settings__curtain--disabled'}`}></div>
        <h1 className="settings__floor-title">Установки теплых полов в бане</h1>

        <p className="settings__row-title">Активный режим</p>
        <input className="settings__mode-switch" type="radio" name="mode"
          id="mode_in" value={Mode.IN} onChange={paramChangeHandler}
          checked={currentSettings.mode === Mode.IN}
          disabled={!edit}
        />
        <label className="settings__mode-label" htmlFor="mode_in">хозяин в бане</label>

        <input className="settings__mode-switch" type="radio" name="mode"
          id="mode_out" value={Mode.OUT} onChange={paramChangeHandler}
          checked={currentSettings.mode === Mode.OUT} disabled={!edit} />
        <label className="settings__mode-label settings__mode-label--out" htmlFor="mode_out">никого нет</label>

        <p className="settings__row-title">Cредняя температура</p>
        <input className="settings__temp settings__temp--in" type="number"
          name="tempIn" step="0.1" min="0" max="60"
          onChange={paramChangeHandler} value={currentSettings.tempIn}
          disabled={!edit}
          required />
        <input className="settings__temp settings__temp--out" type="number"
        name="tempOut" step="0.1" min="0" max="60" onChange={paramChangeHandler}
        value={currentSettings.tempOut}
        disabled={!edit}
        required />

        <p className="settings__row-title">Отклонение температуры</p>
        <input className="settings__temp-delta" name="tempDelta" type="number" step="0.1" min="0" max="30" onChange={paramChangeHandler}
          value={currentSettings.tempDelta} required />
      </section>

      <input className="button settings__submit" type="submit" value={edit ? 'СОХРАНИТЬ УСТАНОВКИ' : 'ИЗМЕНИТЬ УСТАНОВКИ'}/>
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