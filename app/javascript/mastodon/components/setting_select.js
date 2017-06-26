import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

class SettingSelect extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    settingKey: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    groups: ImmutablePropTypes.map.isRequired,
  };

  handleChange = (e) => {
    this.props.onChange(this.props.settingKey, e.target.value);
  }

  render () {
    const { settings, settingKey, groups, intl } = this.props;

    return (
      <select 
        className='setting-select'
        onChange={this.handleChange}
        value={settings.getIn(settingKey)}
      >
      {
        groups.map(
          (group, index) => {
            var message = { id: 'column.area.setting.' + group, defaultMessage: group };
            return <option key={index} value={group}>{intl.formatMessage(message)}</option>
          }
        )
      }
      </select>
    );
  }

}

export default injectIntl(SettingSelect);
