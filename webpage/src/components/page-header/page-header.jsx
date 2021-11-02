import React from 'react';

const PageHeader = () => (
  <header className="page-header">
    <div className="container">
      <div className="page-header__wrapper">
        <a className="page-header__logo" href="/">
          <img className="page-header__logo-image" src="/icon-logo.svg" width="120" height="40" alt="SmartHome logo" />
          <span className="page-header__logo-title">SmartHome</span>
        </a>
      </div>
    </div>
  </header>
);

export default PageHeader;
