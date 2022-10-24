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
          <a href="https://docs.facewallet.xyz/docs/overview" target="_blank" rel="noreferrer">
            <ExternalIcon />
            Docs
          </a>
        </li>
        <li>
          <a
            href="https://www.figma.com/file/EFdYprD8iEP6bEKtkBbUIM/Face-Wallet-User-Flow?node-id=0%3A1"
            target="_blank"
            rel="noreferrer">
            <ExternalIcon />
            User Flow
          </a>
        </li>
        <li>
          <a href="https://haechi.typeform.com/to/RQd6k1Y6" target="_blank" rel="noreferrer">
            <ExternalIcon />
            Integrate for FREE
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default GNB;
