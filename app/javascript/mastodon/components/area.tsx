import React from 'react';

import type { Account } from 'mastodon/models/account';

import hyogo_areas from '../../hyogo-areas.json';
import remote_instances from '../../remote-instances.json';

type AreaId = number;

interface AreaConfig {
  'area-id': AreaId;
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
  config: Record<AreaId, AreaConfig>;
  instances: Record<InstanceDomain, InstanceConfig>;

  constructor(props: Props) {
    super(props);
    const areas = hyogo_areas.areas;
    this.instances = remote_instances as Record<InstanceDomain, InstanceConfig>;
    this.config = {};
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
    return this.getFromConfigOrDefault(area_id)['area-eng-name'];
  }

  get_remote_area_eng_name(account: Account): string {
    const domain = account.acct.split('@').at(-1) ?? '';
    return (
      this.instances[domain]?.['instance-eng-name'] ??
      this.get_local_area_eng_name(0)
    );
  }

  get_area_short_name(account: Account): string {
    if (this.is_local(account)) {
      return this.get_local_area_short_name(account.area);
    } else {
      return this.get_remote_area_short_name(account);
    }
  }

  get_local_area_short_name(area_id: number): string {
    return this.getFromConfigOrDefault(area_id)['area-short-name'];
  }

  get_remote_area_short_name(account: Account): string {
    const domain = account.acct.split('@').at(-1) ?? '';
    return (
      this.instances[domain]?.['instance-short-name'] ??
      this.get_local_area_short_name(0)
    );
  }

  getFromConfigOrDefault(key: AreaId): AreaConfig {
    // 存在しない場合は0にフォールバック。0は未設定の値が入っている
    return (
      this.config[key] ??
      this.config[0] ??
      (() => {
        throw new Error('No valid area config found');
      })()
    );
  }

  is_local(account: Account): boolean {
    return account.username === account.acct;
  }
}

// eslint-disable-next-line import/no-default-export
export default Area;
