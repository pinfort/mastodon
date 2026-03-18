import type { Account } from 'mastodon/models/account';
import { getAreaEngName, getAreaShortName } from 'mastodon/utils/area';

interface Props {
  account: Account;
}

export const AreaHeader = ({ account }: Props) => (
  <span className='account__header__area-wrapper'>
    <span className={'account__header__area-' + getAreaEngName(account)}>
      {getAreaShortName(account)}
    </span>
  </span>
);
