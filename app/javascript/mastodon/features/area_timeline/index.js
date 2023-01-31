import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AreaStatusListContainer from '../ui/containers/area_status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import {
  expandAreaTimeline,
} from '../../actions/timelines';
import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ColumnSettingsContainer from './containers/column_settings_container';
import { connectAreaStream } from '../../actions/streaming';
import { Helmet } from 'react-helmet';

const messages = defineMessages({
  title: { id: 'column.area', defaultMessage: 'Area timeline' },
});

const mapStateToProps = (state, { columnId }) => {
  const uuid = columnId;
  const columns = state.getIn(['settings', 'columns']);
  const index = columns.findIndex(c => c.get('uuid') === uuid);
  const timelineState = state.getIn(['timelines', `area:${columns.get(index).getIn(['params', 'id'])}`]);

  return {
    hasUnread: !!timelineState && timelineState.get('unread') > 0,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class AreaTimeline extends React.PureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
    hasUnread: PropTypes.bool,
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
    const { columnId, dispatch } = this.props;
    const { id } = this.props.params;

    dispatch(expandAreaTimeline(columnId, id));
    this.disconnect = dispatch(connectAreaStream(columnId, id));
  }

  componentDidUpdate (prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      const { columnId, dispatch } = this.props;
      const { id } = this.props.params;

      this.disconnect();
      dispatch(expandAreaTimeline(columnId, id));
      this.disconnect = dispatch(connectAreaStream(columnId, id));
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  setRef = c => {
    this.column = c;
  }

  handleLoadMore = maxId => {
    this.props.dispatch(expandAreaTimeline(this.props.columnId, this.props.params.id, { maxId }));
  }

  render () {
    const { intl, hasUnread, columnId, multiColumn } = this.props;
    const { id } = this.props.params;
    const pinned = !!columnId;
    var message = { id: 'column.area.timeline.' + id, defaultMessage: id };

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
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
          <ColumnSettingsContainer columnId={columnId} />
        </ColumnHeader>

        <AreaStatusListContainer
          trackScroll={!pinned}
          scrollKey={`area_timeline-${columnId}`}
          timelineId={`area:${columnId}:${id}`}
          settingTimelineId='area'
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.area' defaultMessage='There is nothing in this area yet.' />}
          bindToDocument={!multiColumn}
        />

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}
