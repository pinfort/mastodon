import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router'

class AreaTimelineRedirect extends React.PureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    streamingAPIBaseURL: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    hasUnread: PropTypes.bool,
    multiColumn: PropTypes.bool,
  };

  render () {
    var area = this.state.getIn(['settings', 'area']).getIn(['area', 'body']);

    return (
      <Redirect to="/area/${area}" />
    );
  }

}

export default AreaTimelineRedirect;
