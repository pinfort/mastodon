import PropTypes from 'prop-types';

class Area extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    var areas = require("../../area_settings.json")['areas'];
    this.config = [];
    areas.forEach(function(data, index, arr) {
      this.config[data['area-id']] = data;
    }, this);
    this.get_area_className = this.get_area_className.bind(this);
    this.get_area_short_name = this.get_area_short_name.bind(this);
  }

  get_area_className(area_id){
    if (isNaN(area_id)) {
      area_id = 0;
    };
    try{
      var area_eng_name = this.config[area_id]["area-eng-name"];
    } catch (e) {
      var area_eng_name = this.config[0]["area-eng-name"];
    }
    return ("account__avatar__area-" + area_eng_name);
  }

  get_area_short_name(area_id){
    if (isNaN(area_id)) {
      area_id = 0;
    };
    try {
      var area_short_name = this.config[area_id]["area-short-name"];
    } catch (e) {
      var area_short_name = this.config[0]["area-short-name"];
    }
    return (area_short_name);
  }

  render () {

    return (
      <div className='account__avatar__area-wrapper'>
        <span className={this.get_area_className(this.props.areaId)}>{this.get_area_short_name(this.props.areaId)}</span>
      </div>
    );
  }

}

Area.propTypes = {
  areaId: PropTypes.number.isRequired
};

export default Area;
