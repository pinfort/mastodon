import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

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
    const { settings, settingKey, groups } = this.props;

    return (
      <select 
        className='setting-text'
        onChange={this.handleChange}
        value={settings.getIn(settingKey)}
      >
      {
        groups.map(
          (group, index) => {
            return <option key={index} value={group}>{group}</option>
          }
        )
      }
      </select>
    );
  }

}

export default SettingSelect;
