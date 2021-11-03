import React from 'react';

const PageHeader = () => (
  <header className="page-header">
    <div className="container">
      <div className="page-header__wrapper">
        <a className="page-header__logo" href="/">
          <img className="page-header__logo-image" src="/favicon.svg" width="50" height="50" alt="SmartHome logo" />
          <span className="page-header__logo-title">SmartHome</span>
        </a>
      </div>
    </div>
  </header>
);

export default PageHeader;
