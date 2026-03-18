import type { Account } from 'mastodon/models/account';

import Area from './area';

class AreaHeader extends Area {
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
