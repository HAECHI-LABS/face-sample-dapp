import { ReactComponent as ExternalIcon } from '../assets/external-link-line.svg';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as CloseIcon } from '../assets/menu-close.svg';
import { ReactComponent as MenuIcon } from '../assets/menu-fill.svg';

function GNB() {
  return (
    <nav className="gnb">
      <div className="logo-wrapper">
        <Logo className="logo" />
        <label className="mobile menu-toggle" htmlFor="toggle">
          <MenuIcon className="menu-icon" />
          <CloseIcon className="close-icon" />
          <input id="toggle" type="checkbox" />
        </label>
      </div>
      <ul className="menus">
        <li>
          <a href="#" target="_blank">
            <ExternalIcon />
            Docs
          </a>
        </li>
        <li>
          <a href="#" target="_blank">
            <ExternalIcon />
            User Flow
          </a>
        </li>
        <li>
          <a href="#" target="_blank">
            <ExternalIcon />
            Integrate for FREE
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default GNB;
