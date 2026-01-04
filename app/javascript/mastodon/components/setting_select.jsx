import PropTypes from 'prop-types';
import React from 'react';

import { injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';

import { browserHistory } from './router';

class SettingSelect extends React.PureComponent {
  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    settingKey: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    groups: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleChange = (e) => {
    this.props.onChange(this.props.settingKey, e.target.value);
    const { settingKey } = this.props;
    if (settingKey.length === 2 && settingKey[0] === 'area' && settingKey[1] === 'body') {
      browserHistory.push('/areas');
    }
  };

  render () {
    const { settings, settingKey, groups, intl } = this.props;

    return (
      <select
        className='setting-select'
        onChange={this.handleChange}
        value={settings.getIn(settingKey)}
      >
        {
          Object.keys(groups).map(
            (groupKey) => {
              const group = groups[groupKey];

              const message = { id: 'column.area.setting.' + group, defaultMessage: group };
              return <option key={groupKey} value={group}>{intl.formatMessage(message)}</option>;
            },
          )
        }
      </select>
    );
  }

}

export default injectIntl(SettingSelect);
