import PropTypes from 'prop-types';

class Area extends React.Component {
  constructor(props) {
    super(props);
    this.config = require("../../../../area_settings.json")['areas'];
    this.get_area_className = this.get_area_className.bind(this);
    this.get_area_short_name = this.get_area_short_name.bind(this);
  }

  get_area_className(area_id){
    if (isNaN(area_id)) {
      area_id = 0;
    }
    return ("account__header__area-" + this.config[area_id]["area-eng-name"]);
  }

  get_area_short_name(area_id){
    if (isNaN(area_id)) {
      area_id = 0;
    }
    return (this.config[area_id]["area-short-name"]);
  }

  render() {
    return (
      <span className="account__header__area-wrapper">
        <span className={this.get_area_className(this.props.areaId)}>{this.get_area_short_name(this.props.areaId)}</span>
      </span>
    );
  }
}

Area.propTypes = {
  areaId: PropTypes.number.isRequired
};
