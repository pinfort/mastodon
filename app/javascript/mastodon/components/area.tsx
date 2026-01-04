import React from 'react';

import hyogoAreas from '../../hyogo-areas.json';
import remoteInstances from '../../remote-instances.json';
import type { Account } from '../models/account';

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

interface AreaProps {
  account: Account;
}

type InstancesRecord = Record<string, InstanceConfig>;

class Area extends React.PureComponent<AreaProps> {
  config: AreaConfig[];
  instances: InstancesRecord;

  constructor(props: AreaProps) {
    super(props);
    const areas = hyogoAreas.areas;
    this.instances = remoteInstances as InstancesRecord;
    this.config = [];
    areas.forEach((data) => {
      this.config[data['area-id']] = data;
    });
    this.getAreaEngName = this.getAreaEngName.bind(this);
    this.getAreaShortName = this.getAreaShortName.bind(this);
    this.getLocalAreaEngName = this.getLocalAreaEngName.bind(this);
    this.getRemoteAreaEngName = this.getRemoteAreaEngName.bind(this);
    this.getLocalAreaShortName = this.getLocalAreaShortName.bind(this);
    this.getRemoteAreaShortName = this.getRemoteAreaShortName.bind(this);
    this.isLocal = this.isLocal.bind(this);
  }

  getAreaEngName(account: Account): string {
    if (this.isLocal(account)) {
      return this.getLocalAreaEngName(account.get('area'));
    } else {
      return this.getRemoteAreaEngName(account);
    }
  }

  getLocalAreaEngName(areaId: number): string {
    let normalizedAreaId = areaId;
    if (typeof normalizedAreaId !== 'number' || isNaN(normalizedAreaId)) {
      normalizedAreaId = 0;
    }
    const configEntry = this.config[normalizedAreaId];
    if (configEntry) {
      return configEntry['area-eng-name'];
    }
    return this.config[0]?.['area-eng-name'] ?? 'unknown';
  }

  getRemoteAreaEngName(account: Account): string {
    const acct = account.get('acct');
    const splitName = acct.split('@');
    const domain = splitName[splitName.length - 1];
    if (domain) {
      const instanceSetting = this.instances[domain];
      if (instanceSetting) {
        return instanceSetting['instance-eng-name'];
      }
    }
    return this.getLocalAreaEngName(0);
  }

  getAreaShortName(account: Account): string {
    if (this.isLocal(account)) {
      return this.getLocalAreaShortName(account.get('area'));
    } else {
      return this.getRemoteAreaShortName(account);
    }
  }

  getLocalAreaShortName(areaId: number): string {
    let normalizedAreaId = areaId;
    if (typeof normalizedAreaId !== 'number' || isNaN(normalizedAreaId)) {
      normalizedAreaId = 0;
    }
    const configEntry = this.config[normalizedAreaId];
    if (configEntry) {
      return configEntry['area-short-name'];
    }
    return this.config[0]?.['area-short-name'] ?? '未';
  }

  getRemoteAreaShortName(account: Account): string {
    const acct = account.get('acct');
    const splitName = acct.split('@');
    const domain = splitName[splitName.length - 1];
    if (domain) {
      const instanceSetting = this.instances[domain];
      if (instanceSetting) {
        return instanceSetting['instance-short-name'];
      }
    }
    return this.getLocalAreaShortName(0);
  }

  isLocal(account: Account): boolean {
    return account.get('username') === account.get('acct');
  }
}

export default Area;
