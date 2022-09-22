import { utils } from 'ethers';
import { useRecoilValue } from 'recoil';

import { accountAtom } from '../store/accountAtom';

function AccountInformation() {
  const account = useRecoilValue(accountAtom);

  if (!account.balance || !account.address) {
    return null;
  }

  return (
    <div className="AccountInformation">
      <div className="notification is-primary is-light">
        {account.address && <div>Address: {account.address}</div>}
        {account.balance && <div>Balance: {utils.formatEther(account.balance)}</div>}
      </div>
    </div>
  );
}

export default AccountInformation;
