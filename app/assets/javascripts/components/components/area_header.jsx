import Area from './area';

class Area_header extends Area {
  constructor(props) {
    super(props);
  }

  get_area_className(area_id){
    return ("account__header__area-" + this.get_area_eng_name(area_id));
  }

  render () {
    return (
      <span className="account__header__area-wrapper">
        <span className={this.get_area_className(this.props.areaId)}>{this.get_area_short_name(this.props.areaId)}</span>
      </span>
    );
  }
}

Area_header.propTypes = {
  areaId: PropTypes.number.isRequired
};

export default Area_header;
