import { connect } from 'react-redux';
import ColumnSettings from '../components/column_settings';
import { changeSetting } from '../../../actions/settings';
import { changeColumnParams } from '../../../actions/columns';

const mapStateToProps = (state, { columnId }) => {
  const uuid = columnId;
  const columns = state.getIn(['settings', 'columns']);
  const index = columns.findIndex(c => c.get('uuid') === uuid);

  return {
    settings: (uuid && index >= 0) ? columns.get(index).get('params') : state.getIn(['settings', 'area']),
    pinned: !!columnId,
  };
};

const mapDispatchToProps = (dispatch, { columnId }) => {
  return {
    onChange (key, areaName) {
      if (columnId) {
        dispatch(changeColumnParams(columnId, key, areaName));
      } else {
        dispatch(changeSetting(['area', ...key], areaName));
      }
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ColumnSettings);
