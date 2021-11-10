import React from 'react';

import StateBoard from '../state-board/state-board';
import Settings from '../settings/settings';

import Toggler from '../toggler/toggler';
import GetStateBtn from "../get-state-btn/get-state-btn";
import GetSettingsBtn from "../get-settings-btn/get-settings-btn";

// удалить позже
const testPanelStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '200px',
  marginTop: '30px',
  marginBottom: '30px',
};

const PageMain = () => (
  <main className="page-main container">
    <StateBoard />
    <Settings />

    {/* удалить контейнер вместе с содержимым позже */}
    <div style={testPanelStyle}>
      <Toggler label="Вкл/Вкл встроенного диода" />
      {/* <GetStateBtn label="Получить состояние" />
      <GetSettingsBtn label="Получить настройки" /> */}
    </div>
  </main>
);

export default PageMain;
