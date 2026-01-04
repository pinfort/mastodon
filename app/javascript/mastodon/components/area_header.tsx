import type { Account } from '../models/account';

import Area from './area';

interface AreaHeaderProps {
  account: Account;
}

class AreaHeader extends Area {
  constructor(props: AreaHeaderProps) {
    super(props);
    this.getAreaClassName = this.getAreaClassName.bind(this);
  }

  getAreaClassName(account: Account): string {
    return 'account__header__area-' + this.getAreaEngName(account);
  }

  render() {
    return (
      <span className='account__header__area-wrapper'>
        <span className={this.getAreaClassName(this.props.account)}>
          {this.getAreaShortName(this.props.account)}
        </span>
      </span>
    );
  }
}

export default AreaHeader;
