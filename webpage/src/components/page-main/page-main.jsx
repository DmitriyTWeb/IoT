import React from 'react';
import { useDispatch } from 'react-redux';

import StateBoard from '../state-board/state-board';
import Settings from '../settings/settings';

import Toggler from '../toggler/toggler';
// import GetStateBtn from "../get-state-btn/get-state-btn";
// import GetSettingsBtn from "../get-settings-btn/get-settings-btn";
import { getPostsFromServer } from '../../store/api-actions';

// удалить позже
const testPanelStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '200px',
  marginTop: '30px',
  marginBottom: '30px',
};



const PageMain = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(getPostsFromServer(10));
  };

  return(
    <main className="page-main my-0 mx-auto sm:px-4 md:px-8 w-11/12">
      <StateBoard />
      <Settings />

      {/* удалить контейнер вместе с содержимым позже */}
      <div style={testPanelStyle}>
        <Toggler label="Вкл/Вкл встроенного диода" />
        {/* <GetStateBtn label="Получить состояние" />
      <GetSettingsBtn label="Получить настройки" /> */}
        <input type="button" onClick={handleClick} value="Get posts" />
      </div>
    </main>
  );
};

export default PageMain;
