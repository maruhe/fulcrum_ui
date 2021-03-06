import React, { Component } from "react";

export class FooterMenu extends Component {
  public render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu__item">
          <a href="https://torque.loans/tos/">Terms of use</a>
        </div>
        <div className="footer-menu__item">
          <a href="https://torque.loans/privacy/">Privacy policy</a>
        </div>
        <div className="footer-menu__item">
          <a href="https://fulcrum.trade">Lending &amp; Trading</a>
        </div>
      </div>
    );
  }
}
