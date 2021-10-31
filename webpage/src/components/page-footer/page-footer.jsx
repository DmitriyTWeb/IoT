import React from 'react';

const PageFooter = (props) => (
  <footer className="page-footer">
    <div className="container">
      <div className="page-footer__wrapper">
        <a className="page-footer__logo" href="/">
          Powered by SmartHome
        </a>
        <div className="page-footer__copyright copyright">
          <a className="copyright__link" href="/">
            {/* <img className="copyright__img" src="img/icon-logo-grey.svg" width="100" height="40" alt="RecycleID logo" /> */}
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default PageFooter;
