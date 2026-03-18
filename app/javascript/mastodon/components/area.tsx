import React from 'react';

import type { Account } from 'mastodon/models/account';

import hyogo_areas from '../../hyogo-areas.json';
import remote_instances from '../../remote-instances.json';

interface AreaConfig {
  'area-id': number;
  'area-name': string;
  'area-short-name': string;
  'area-eng-name': string;
}

interface InstanceConfig {
  'instance-name': string;
  'instance-short-name': string;
  'instance-eng-name': string;
}

type InstanceDomain = string;

interface Props {
  account: Account;
}

class Area extends React.PureComponent<Props> {
  config: AreaConfig[];
  instances: Record<InstanceDomain, InstanceConfig>;

  constructor(props: Props, context: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    super(props, context);
    const areas = hyogo_areas.areas;
    this.instances = remote_instances as Record<InstanceDomain, InstanceConfig>;
    this.config = [];
    areas.forEach(function (this: Area, data) {
      this.config[data['area-id']] = data;
    }, this);
    this.get_area_eng_name = this.get_area_eng_name.bind(this);
    this.get_area_short_name = this.get_area_short_name.bind(this);
    this.get_local_area_eng_name = this.get_local_area_eng_name.bind(this);
    this.get_remote_area_eng_name = this.get_remote_area_eng_name.bind(this);
    this.get_local_area_short_name = this.get_local_area_short_name.bind(this);
    this.get_remote_area_short_name =
      this.get_remote_area_short_name.bind(this);
    this.is_local = this.is_local.bind(this);
  }

  get_area_eng_name(account: Account): string {
    if (this.is_local(account)) {
      return this.get_local_area_eng_name(account.area);
    } else {
      return this.get_remote_area_eng_name(account);
    }
  }

  get_local_area_eng_name(area_id: number): string {
    if (isNaN(area_id)) {
      area_id = 0;
    }
    let area_eng_name: string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      area_eng_name = this.config[area_id]!['area-eng-name'];
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      area_eng_name = this.config[0]!['area-eng-name'];
    }
    return area_eng_name;
  }

  get_remote_area_eng_name(account: Account): string {
    const splitName = account.acct.split('@');
    const domain = splitName.at(-1) ?? '';
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const instanceSetting = this.instances[domain]!;
      const area_eng_name = instanceSetting['instance-eng-name'];
      return area_eng_name;
    } catch {
      return this.get_local_area_eng_name(0);
    }
  }

  get_area_short_name(account: Account): string {
    if (this.is_local(account)) {
      return this.get_local_area_short_name(account.area);
    } else {
      return this.get_remote_area_short_name(account);
    }
  }

  get_local_area_short_name(area_id: number): string {
    if (isNaN(area_id)) {
      area_id = 0;
    }
    let area_short_name: string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      area_short_name = this.config[area_id]!['area-short-name'];
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      area_short_name = this.config[0]!['area-short-name'];
    }
    return area_short_name;
  }

  get_remote_area_short_name(account: Account): string {
    const splitName = account.acct.split('@');
    const domain = splitName.at(-1) ?? '';
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const instanceSetting = this.instances[domain]!;
      const area_short_name = instanceSetting['instance-short-name'];
      return area_short_name;
    } catch {
      return this.get_local_area_short_name(0);
    }
  }

  is_local(account: Account): boolean {
    return account.username === account.acct;
  }
}

// eslint-disable-next-line import/no-default-export
export default Area;
