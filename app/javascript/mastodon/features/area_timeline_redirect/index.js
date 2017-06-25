import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({
  settings: state.getIn(['settings', 'area']),
});

class AreaTimelineRedirect extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
    streamingAPIBaseURL: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    hasUnread: PropTypes.bool,
  };

  readAreas () {
    var area_data = require("../../../../area_settings.json");
    groups = area_data['instance-areas'];
    var areas = new Array();
    groups.map((option, index) => {
        areas[option.group_id] = option.group_name;
    });
    return areas;
  };

  render () {
    var areaIn = state.getIn(['settings', 'area']).getIn(['area', 'body']);
    var areas = this.readAreas();
    var area = areas[areaIn]

    return (
      <Redirect to="/timelines/area/${area}" />
    );
  }

}

export default connect(mapStateToProps)(AreaTimelineRedirect);
