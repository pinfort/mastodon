import Area from './area';

class Area_header extends Area {
  constructor (props, context) {
    super(props, context);
    this.get_area_class_name = this.get_area_class_name.bind(this);
  }

  get_area_class_name(area_id){
    return ("account__header__area-" + this.get_area_eng_name(area_id));
  }

  render () {
    return (
      <span className="account__header__area-wrapper">
        <span className={this.get_area_class_name(this.props.account.get('area'))}>{this.get_area_short_name(this.props.account.get('area'))}</span>
      </span>
    );
  }
}

Area_header.propTypes = {
  account: ImmutablePropTypes.map.isRequired
};

export default Area_header;
