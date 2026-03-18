import type { Account } from 'mastodon/models/account';

import Area from './area';

interface Props {
  account: Account;
}

class AreaHeader extends Area {
  declare props: Props;
  declare get_area_eng_name: (account: Account) => string;
  declare get_area_short_name: (account: Account) => string;

  constructor(props: Props) {
    super(props);
    this.get_area_class_name = this.get_area_class_name.bind(this);
  }

  get_area_class_name(account: Account): string {
    return 'account__header__area-' + this.get_area_eng_name(account);
  }

  override render() {
    return (
      <span className='account__header__area-wrapper'>
        <span className={this.get_area_class_name(this.props.account)}>
          {this.get_area_short_name(this.props.account)}
        </span>
      </span>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default AreaHeader;
