/* eslint-disable import/no-named-as-default */
import React from 'react';

import Toggler from '../toggler/toggler';
import GetStatusBtn from "../get-status-btn/get-status-btn";

const PageMain = () => (
  <main className="page-main container">
    <Toggler label="Toggle test LED"/>
    <GetStatusBtn label="Get NodeMCU status"/>
  </main>
);

export default PageMain;
