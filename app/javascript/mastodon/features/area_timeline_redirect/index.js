import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

const mapStateToProps = state => ({
  area: state.getIn(['settings', 'area']).getIn(['area', 'body']),
});

export default @connect(mapStateToProps)
class AreaTimelineRedirect extends React.PureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    multiColumn: PropTypes.bool,
    area: PropTypes.string,
  };

  render () {
    const { area } = this.props;
    return (
      <Redirect to={`/timelines/area/${area}`} />
    );
  }

}
