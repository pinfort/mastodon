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

const config = new Map<AreaId, AreaConfig>(
  hyogo_areas.areas.map((data) => [data['area-id'], data]),
);

const instances = remote_instances as Record<InstanceDomain, InstanceConfig>;

function getFromConfigOrDefault(key: AreaId): AreaConfig {
  // 存在しない場合は0にフォールバック。0は未設定の値が入っている
  const result = config.get(key) ?? config.get(0);
  if (!result) throw new Error('No valid area config found');
  return result;
}

function isLocal(account: Account): boolean {
  return account.username === account.acct;
}

export function getAreaEngName(account: Account): string {
  if (isLocal(account)) {
    return getFromConfigOrDefault(account.area)['area-eng-name'];
  }
  const domain = account.acct.split('@').at(-1) ?? '';
  return (
    instances[domain]?.['instance-eng-name'] ??
    getFromConfigOrDefault(0)['area-eng-name']
  );
}

export function getAreaShortName(account: Account): string {
  if (isLocal(account)) {
    return getFromConfigOrDefault(account.area)['area-short-name'];
  }
  const domain = account.acct.split('@').at(-1) ?? '';
  return (
    instances[domain]?.['instance-short-name'] ??
    getFromConfigOrDefault(0)['area-short-name']
  );
}
