import React from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';

import Area from './area';

class Area_header extends Area {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
  };
  constructor (props, context) {
    super(props, context);
    this.get_area_class_name = this.get_area_class_name.bind(this);
  }

  get_area_class_name(account){
    return ('account__header__area-' + this.get_area_eng_name(account));
  }

  render () {
    return (
      <span className='account__header__area-wrapper'>
        <span className={this.get_area_class_name(this.props.account)}>{this.get_area_short_name(this.props.account)}</span>
      </span>
    );
  }

}

export default Area_header;
