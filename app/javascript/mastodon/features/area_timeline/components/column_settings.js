import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import SettingSelect from '../../../components/setting_select';

const messages = defineMessages({
  filter_area: { id: 'area.column_settings.filter_area', defaultMessage: 'Filter out by area' },
  settings: { id: 'area.settings', defaultMessage: 'Column settings' },
});

export default @injectIntl
class ColumnSettings extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  readAreas = () => {
    var area_data = require('../../../../area_settings.json');
    var groups = area_data['instance-areas'];
    var areas = new Array();
    groups.map((option, index) => {
      areas[option.group_id] = option.group_name;
    });
    return areas;
  }

  render () {
    const { settings, onChange } = this.props;
    var areas = this.readAreas();

    return (
      <div>
        <span className='column-settings__section'><FormattedMessage id='area.column_settings.basic' defaultMessage='Basic' /></span>

        <div className='column-settings__row'>
          <SettingSelect settings={settings} settingKey={['area', 'body']} onChange={onChange} groups={areas}/>
        </div>
      </div>
    );
  }

}
