import type { Account } from 'mastodon/models/account';

import Area from './area';

interface Props {
  account: Account;
}

class AreaAvatar extends Area {
  declare props: Props;
  declare get_area_eng_name: (account: Account) => string;
  declare get_area_short_name: (account: Account) => string;

  get_area_class_name(account: Account): string {
    return 'account__avatar__area-' + this.get_area_eng_name(account);
  }

  override render() {
    return (
      <div className='account__avatar__area-wrapper'>
        <span className={this.get_area_class_name(this.props.account)}>
          {this.get_area_short_name(this.props.account)}
        </span>
      </div>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default AreaAvatar;
