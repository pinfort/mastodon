import type { Account } from '../models/account';

import Area from './area';

interface AreaAvatarProps {
  account: Account;
}

class AreaAvatar extends Area {
  constructor(props: AreaAvatarProps) {
    super(props);
    this.getAreaClassName = this.getAreaClassName.bind(this);
  }

  getAreaClassName(account: Account): string {
    return 'account__avatar__area-' + this.getAreaEngName(account);
  }

  render() {
    return (
      <div className='account__avatar__area-wrapper'>
        <span className={this.getAreaClassName(this.props.account)}>
          {this.getAreaShortName(this.props.account)}
        </span>
      </div>
    );
  }
}

export default AreaAvatar;
