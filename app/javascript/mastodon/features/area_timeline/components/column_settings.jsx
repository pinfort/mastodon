import PropTypes from 'prop-types';
import React from 'react';

import { injectIntl, FormattedMessage } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';

import SettingSelect from '../../../components/setting_select';

export default @injectIntl
class ColumnSettings extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    pinned: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  readAreas = () => {
    var area_data = require('../../../../area_settings.json');
    var groups = area_data['instance-areas'];
    var areas = new Array();
    groups.map((option) => {
      areas[option.group_id] = option.group_name;
    });
    return areas;
  }

  render () {
    const { settings, pinned, onChange } = this.props;
    var areas = this.readAreas();
    var settingKey = [];
    if (pinned) {
      // そのカラムが固定されていたら ['settings', 'columns', $UUID, 'params', 'id'] に地域名を格納
      settingKey = ['id'];
    } else {
      // 固定されていなければ、 ['settings', 'area', 'area', 'body'] に地域名を格納
      settingKey = ['area', 'body'];
    }

    return (
      <div>
        <span className='column-settings__section'><FormattedMessage id='area.column_settings.basic' defaultMessage='Basic' /></span>

        <div className='column-settings__row'>
          <SettingSelect settings={settings} settingKey={settingKey} onChange={onChange} groups={areas} />
        </div>
      </div>
    );
  }

}
