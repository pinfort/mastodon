import React from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';

class Area extends React.PureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
  };

  constructor (props, context) {
    super(props, context);
    this.props = props;
    var area_data = require('../../area_settings.json');
    var areas = area_data.areas;
    this.instances = area_data.instances;
    this.config = [];
    areas.forEach(function(data) {
      this.config[data['area-id']] = data;
    }, this);
    this.get_area_eng_name = this.get_area_eng_name.bind(this);
    this.get_area_short_name = this.get_area_short_name.bind(this);
    this.get_local_area_eng_name = this.get_local_area_eng_name.bind(this);
    this.get_remote_area_eng_name = this.get_remote_area_eng_name.bind(this);
    this.get_local_area_short_name = this.get_local_area_short_name.bind(this);
    this.get_remote_area_short_name = this.get_remote_area_short_name.bind(this);
    this.is_local = this.is_local.bind(this);
  }

  get_area_eng_name(account){
    if (this.is_local(account)){
      return (this.get_local_area_eng_name(account.get('area')));
    }else{
      return (this.get_remote_area_eng_name(account));
    }
  }

  get_local_area_eng_name(area_id){
    if (isNaN(area_id)) {
      area_id = 0;
    };
    var area_eng_name;
    try{
      area_eng_name = this.config[area_id]['area-eng-name'];
    } catch (e) {
      area_eng_name = this.config[0]['area-eng-name'];
    }
    return (area_eng_name);
  }

  get_remote_area_eng_name(account){
    var splittedName = account.get('acct').split('@');
    var domain = splittedName[splittedName.length - 1];
    try{
      var instanceSetting = this.instances[domain];
      var area_eng_name = instanceSetting['instance-eng-name'];
    }catch (e) {
      return this.get_local_area_eng_name(0);
    }
    return (area_eng_name);
  }

  get_area_short_name(account){
    if (this.is_local(account)){
      return (this.get_local_area_short_name(account.get('area')));
    }else{
      return (this.get_remote_area_short_name(account));
    }
  }

  get_local_area_short_name(area_id){
    if (isNaN(area_id)) {
      area_id = 0;
    };
    var area_short_name;
    try{
      area_short_name = this.config[area_id]['area-short-name'];
    } catch (e) {
      area_short_name = this.config[0]['area-short-name'];
    }
    return (area_short_name);
  }

  get_remote_area_short_name(account){
    var splittedName = account.get('acct').split('@');
    var domain = splittedName[splittedName.length - 1];
    try{
      var instanceSetting = this.instances[domain];
      var area_short_name = instanceSetting['instance-short-name'];
    }catch (e) {
      return this.get_local_area_short_name(0);
    }
    return (area_short_name);
  }

  is_local(account){
    return (account.get('username') === account.get('acct'));
  }

}

export default Area;
