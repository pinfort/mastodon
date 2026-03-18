import type { Account } from 'mastodon/models/account';

import { getAreaEngName, getAreaShortName } from './area';

interface Props {
  account: Account;
}

export const AreaAvatar = ({ account }: Props) => (
  <div className='account__avatar__area-wrapper'>
    <span className={'account__avatar__area-' + getAreaEngName(account)}>
      {getAreaShortName(account)}
    </span>
  </div>
);
