import type { Account } from 'mastodon/models/account';

import { Area } from './area';

class AreaHeader extends Area {
  private getAreaClassName(account: Account): string {
    return 'account__header__area-' + this.getAreaEngName(account);
  }

  override render() {
    return (
      <span className='account__header__area-wrapper'>
        <span className={this.getAreaClassName(this.props.account)}>
          {this.getAreaShortName(this.props.account)}
        </span>
      </span>
    );
  }
}

export { AreaHeader };
