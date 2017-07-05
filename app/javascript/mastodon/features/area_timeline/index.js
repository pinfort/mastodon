import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AreaStatusListContainer from '../ui/containers/area_status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import {
  refreshAreaTimeline,
  expandAreaTimeline,
  updateTimeline,
  deleteFromTimelines,
  connectTimeline,
  disconnectTimeline,
} from '../../actions/timelines';
import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ColumnSettingsContainer from './containers/column_settings_container';
import createStream from '../../stream';

const messages = defineMessages({
  title: { id: 'column.area', defaultMessage: 'Area timeline' },
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', `area:${state.getIn(['settings', 'area', 'area', 'body'])}`, 'unread']) > 0,
  streamingAPIBaseURL: state.getIn(['meta', 'streaming_api_base_url']),
  accessToken: state.getIn(['meta', 'access_token']),
});

@connect(mapStateToProps)
@injectIntl
export default class AreaTimeline extends React.PureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    streamingAPIBaseURL: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    hasUnread: PropTypes.bool,
    multiColumn: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('AREA', { id: this.props.params.id }));
    }
  }

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  }

  componentDidMount () {
    const { dispatch, streamingAPIBaseURL, accessToken } = this.props;
    const { id } = this.props.params;

    dispatch(refreshAreaTimeline(id));

    if (typeof this._subscription !== 'undefined') {
      return;
    }

    this._subscription = createStream(streamingAPIBaseURL, accessToken, `area&area=${id}`, {

      connected () {
        dispatch(connectTimeline(`area:${id}`));
      },

      reconnected () {
        dispatch(connectTimeline(`area:${id}`));
      },

      disconnected () {
        dispatch(disconnectTimeline(`area:${id}`));
      },

      received (data) {
        switch(data.event) {
        case 'update':
          dispatch(updateTimeline(`area:${id}`, JSON.parse(data.payload)));
          break;
        case 'delete':
          dispatch(deleteFromTimelines(data.payload));
          break;
        }
      },

    });
  }

  componentWillUnmount () {
    if (typeof this._subscription !== 'undefined') {
      this._subscription.close();
      this._subscription = null;
    }
  }

  setRef = c => {
    this.column = c;
  }

  handleLoadMore = () => {
    this.props.dispatch(expandAreaTimeline(this.props.params.id));
  }

  render () {
    const { intl, hasUnread, columnId, multiColumn } = this.props;
    const { id } = this.props.params;
    const pinned = !!columnId;
    var message = { id: 'column.area.timeline.' + id, defaultMessage: id };

    return (
      <Column ref={this.setRef}>
        <ColumnHeader
          icon='map-marker'
          active={hasUnread}
          title={intl.formatMessage(message)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
        >
          <ColumnSettingsContainer />
        </ColumnHeader>

        <AreaStatusListContainer
          trackScroll={!pinned}
          scrollKey={`area_timeline-${columnId}`}
          timelineId={`area:${id}`}
          settingTimelineId='area'
          loadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.area' defaultMessage='There is nothing in this area yet.' />}
        />
      </Column>
    );
  }

}
