import type { Account } from 'mastodon/models/account';

import { Area } from './area';

class AreaAvatar extends Area {
  private getAreaClassName(account: Account): string {
    return 'account__avatar__area-' + this.getAreaEngName(account);
  }

  override render() {
    return (
      <div className='account__avatar__area-wrapper'>
        <span className={this.getAreaClassName(this.props.account)}>
          {this.getAreaShortName(this.props.account)}
        </span>
      </div>
    );
  }
}

export { AreaAvatar };
