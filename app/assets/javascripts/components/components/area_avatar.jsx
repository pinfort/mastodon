import Area from './area';

class Area_avatar extends Area {
  constructor (props, context) {
    super(props, context);
  }

  get_area_className(area_id){
    return ("account__avatar__area-" + this.get_area_eng_name(area_id));
  }

  render () {
    return (
      <div className='account__avatar__area-wrapper'>
        <span className={this.get_area_className(this.props.areaId)}>{this.get_area_short_name(this.props.areaId)}</span>
      </div>
    );
  }
}

Area_avatar.propTypes = {
  areaId: PropTypes.number.isRequired
};

export default Area_avatar;
