import { useRecoilValue } from 'recoil';

import { formatPlatformCoin } from '../lib/platformCoin';
import { accountAtom } from '../store/accountAtom';
import { networkAtom } from '../store/networkAtom';

function AccountInformation() {
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);

  if (!account.balance || !account.address) {
    return null;
  }

  return (
    <div className="AccountInformation">
      <div className="notification is-primary is-light">
        {account.address && <div>Address: {account.address}</div>}
        {account.balance && <div>Balance: {formatPlatformCoin(account.balance, network)}</div>}
      </div>
    </div>
  );
}

export default AccountInformation;
