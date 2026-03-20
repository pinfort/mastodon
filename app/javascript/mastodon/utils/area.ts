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

const defaultAreaConfig: AreaConfig = {
  'area-id': 0,
  'area-name': '未設定',
  'area-short-name': '未',
  'area-eng-name': 'unknown',
};

interface InstanceConfig {
  'instance-name': string;
  'instance-short-name': string;
  'instance-eng-name': string;
}

type InstanceDomain = string;

const config = new Map<AreaId, AreaConfig>(
  hyogo_areas.areas.map((data) => [data['area-id'], data]),
);

const instances: Record<InstanceDomain, InstanceConfig> = remote_instances;

function getFromConfigOrDefault(key: AreaId): AreaConfig {
  // 存在しない場合は0にフォールバック。0は未設定の値が入っている
  const safeKey = Number.isFinite(key) ? key : 0;
  return config.get(safeKey) ?? config.get(0) ?? defaultAreaConfig;
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
