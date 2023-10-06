import PropTypes from 'prop-types';
import React from 'react';

import { injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';

class SettingSelect extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    settingKey: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    groups: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleChange = (e) => {
    this.props.onChange(this.props.settingKey, e.target.value);
    if (this.props.settingKey.toString() === ['area', 'body'].toString()) {
      this.context.router.history.push('/areas');
    }
  }

  render () {
    const { settings, settingKey, groups, intl } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/no-onchange
      <select
        className='setting-select'
        onChange={this.handleChange}
        value={settings.getIn(settingKey)}
      >
        {
          groups.map(
            (group, index) => {
              var message = { id: 'column.area.setting.' + group, defaultMessage: group };
              return <option key={index} value={group}>{intl.formatMessage(message)}</option>;
            },
          )
        }
      </select>
    );
  }

}

export default injectIntl(SettingSelect);
