import Area from './area';

class Area_avatar extends Area {
  constructor (props, context) {
    super(props, context);
    this.get_area_class_name = this.get_area_class_name.bind(this);
  }

  get_area_class_name(area_id){
    return ("account__avatar__area-" + this.get_area_eng_name(area_id));
  }

  render () {
    return (
      <div className='account__avatar__area-wrapper'>
        <span className={this.get_area_class_name(this.props.account.get('area'))}>{this.get_area_short_name(this.props.account.get(area))}</span>
      </div>
    );
  }
}

Area_avatar.propTypes = {
  account: ImmutablePropTypes.map.isRequired
};

export default Area_avatar;
