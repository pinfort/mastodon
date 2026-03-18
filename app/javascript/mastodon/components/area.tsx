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
  private config: Record<AreaId, AreaConfig>;
  private instances: Record<InstanceDomain, InstanceConfig>;

  constructor(props: Props) {
    super(props);
    this.instances = remote_instances as Record<InstanceDomain, InstanceConfig>;
    this.config = Object.fromEntries(
      hyogo_areas.areas.map((data) => [data['area-id'], data]),
    );
  }

  protected get_area_eng_name(account: Account): string {
    if (this.isLocal(account)) {
      return this.getLocalAreaEngName(account.area);
    } else {
      return this.getRemoteAreaEngName(account);
    }
  }

  private getLocalAreaEngName(area_id: AreaId): string {
    return this.getFromConfigOrDefault(area_id)['area-eng-name'];
  }

  private getRemoteAreaEngName(account: Account): string {
    const domain = account.acct.split('@').at(-1) ?? '';
    return (
      this.instances[domain]?.['instance-eng-name'] ??
      this.getLocalAreaEngName(0)
    );
  }

  protected get_area_short_name(account: Account): string {
    if (this.isLocal(account)) {
      return this.getLocalAreaShortName(account.area);
    } else {
      return this.getRemoteAreaShortName(account);
    }
  }

  private getLocalAreaShortName(area_id: AreaId): string {
    return this.getFromConfigOrDefault(area_id)['area-short-name'];
  }

  private getRemoteAreaShortName(account: Account): string {
    const domain = account.acct.split('@').at(-1) ?? '';
    return (
      this.instances[domain]?.['instance-short-name'] ??
      this.getLocalAreaShortName(0)
    );
  }

  private getFromConfigOrDefault(key: AreaId): AreaConfig {
    // 存在しない場合は0にフォールバック。0は未設定の値が入っている
    return (
      this.config[key] ??
      this.config[0] ??
      (() => {
        throw new Error('No valid area config found');
      })()
    );
  }

  private isLocal(account: Account): boolean {
    return account.username === account.acct;
  }
}

export { Area };
