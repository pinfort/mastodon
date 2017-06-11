import Area from './area';
import ImmutablePropTypes from 'react-immutable-proptypes';

class Area_header extends Area {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired
  };
  constructor = () => {
    super.start();
  }

  get_area_class_name = (account) => {
    return ("account__header__area-" + this.get_area_eng_name(account));
  }

  render () {
    return (
      <span className="account__header__area-wrapper">
        <span className={this.get_area_class_name(this.props.account)}>{this.get_area_short_name(this.props.account)}</span>
      </span>
    );
  }
}

export default Area_header;
