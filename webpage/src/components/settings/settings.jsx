import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setDeviceSettings } from "../../store/api-actions";
import { getDeviceSettingsSelect } from "../../store/selectors/selectors";
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

const Settings = ({ setSettings, settings }) => {
  const { mode = Init.mode, tempIn = Init.tempIn, tempOut = Init.tempOut, tempDelta = Init.tempDelta } = settings;
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
  
  const curtainClassName = `${!edit ? 'block absolute z-10 inset-0  rounded-sm bg-gray-300 opacity-40' : 'hidden'}`;
  
  return(
    <form onSubmit={submitHandler} className="flex flex-col relative py-6 px-4 border border-solid border-gray-400 rounded-md">
      <h1 className="absolute bg-white -top-4 left-4 px-2 text-lg text-slate-500">Настройки системы</h1>

      <section className="relative grid grid-cols-[1fr_2fr_2fr] my-4 xl:my-6 border border-dashed border-gray-400 rounded-md p-4">
        <div className={curtainClassName}></div>
        <h1 className="absolute bg-white left-4 -top-3 py-0 px-2 text-slate-500 rounded-md z-10">Установки теплых полов в бане</h1>

        <p className="m-0 flex item-center mr-4 py-2 px-0">Активный режим</p>
        <input className="sr-only absolute " type="radio" name="mode"
          id="mode_in" value={Mode.IN} onChange={paramChangeHandler}
          checked={currentSettings.mode === Mode.IN}
          disabled={!edit}
        />
        <label 
          className="flex items-center justify-center text-center uppercase border-2 border-gray-400 border-r w-full" 
          htmlFor="mode_in">хозяин в бане
        </label>

        <input className="sr-only" type="radio" name="mode"
          id="mode_out" value={Mode.OUT} onChange={paramChangeHandler}
          checked={currentSettings.mode === Mode.OUT} disabled={!edit} />
        <label className="flex items-center justify-center text-center uppercase border-2 border-gray-400 border-l w-full select-none" htmlFor="mode_out">никого нет</label>

        <p className="m-0 flex item-center mr-4 py-2 px-0">Cредняя температура</p>
        <input className="border text-center border-2 border-r border-t border-gray-400" type="number"
          name="tempIn" step="0.1" min="0" max="60"
          onChange={paramChangeHandler} value={currentSettings.tempIn}
          disabled={!edit}
          required />
        <input className="border text-center border-2 border-l border-t border-gray-400" type="number"
        name="tempOut" step="0.1" min="0" max="60" onChange={paramChangeHandler}
        value={currentSettings.tempOut}
        disabled={!edit}
        required />

        <p className="m-0 flex item-center mr-4 py-2 px-0">Отклонение температуры</p>
        <input className="settings__temp-delta col-start-2 col-end-4 text-center border border-2 border-gray-400 border-t" name="tempDelta" type="number" step="0.1" min="0" max="30" onChange={paramChangeHandler}
          value={currentSettings.tempDelta} required />
      </section>

      <input className="ml-auto bg-blue-100 border border-2 rounded-md px-4 py-2" type="submit" value={edit ? 'СОХРАНИТЬ УСТАНОВКИ' : 'ИЗМЕНИТЬ УСТАНОВКИ'}/>
    </form>
  );
};

const mapStateToProps = (state) => ({
  settings: getDeviceSettingsSelect(state),
});
const mapDispatchToProps = (dispatch) => ({
  setSettings(settings) {
    dispatch(setDeviceSettings(settings));
  }
});

export { Settings };
export default connect(mapStateToProps, mapDispatchToProps)(Settings);