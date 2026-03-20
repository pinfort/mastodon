import type { Account } from 'mastodon/models/account';

import { getAreaEngName, getAreaShortName } from '../area';

function makeAccount(overrides: {
  username: string;
  acct: string;
  area?: number;
}): Account {
  return {
    username: overrides.username,
    acct: overrides.acct,
    area: overrides.area ?? 0,
  } as unknown as Account;
}

describe('getAreaEngName', () => {
  describe('local accounts (username === acct)', () => {
    it('returns "unknown" for area 0 (未設定)', () => {
      const account = makeAccount({
        username: 'alice',
        acct: 'alice',
        area: 0,
      });
      expect(getAreaEngName(account)).toBe('unknown');
    });

    it('returns "kobe" for area 1', () => {
      const account = makeAccount({
        username: 'alice',
        acct: 'alice',
        area: 1,
      });
      expect(getAreaEngName(account)).toBe('kobe');
    });

    it('returns "hanshin" for area 2', () => {
      const account = makeAccount({
        username: 'alice',
        acct: 'alice',
        area: 2,
      });
      expect(getAreaEngName(account)).toBe('hanshin');
    });

    it('returns "tanba" for area 3', () => {
      const account = makeAccount({
        username: 'alice',
        acct: 'alice',
        area: 3,
      });
      expect(getAreaEngName(account)).toBe('tanba');
    });

    it('returns "tajima" for area 4', () => {
      const account = makeAccount({
        username: 'alice',
        acct: 'alice',
        area: 4,
      });
      expect(getAreaEngName(account)).toBe('tajima');
    });

    it('falls back to "unknown" for an undefined area id', () => {
      const account = makeAccount({
        username: 'alice',
        acct: 'alice',
        area: 999,
      });
      expect(getAreaEngName(account)).toBe('unknown');
    });
  });

  describe('remote accounts (username !== acct)', () => {
    it('returns instance eng name for a known instance', () => {
      const account = makeAccount({ username: 'bob', acct: 'bob@pawoo.net' });
      expect(getAreaEngName(account)).toBe('remote-pawoo');
    });

    it('returns instance eng name for mastodon.social', () => {
      const account = makeAccount({
        username: 'carol',
        acct: 'carol@mastodon.social',
      });
      expect(getAreaEngName(account)).toBe('remote-social');
    });

    it('falls back to "unknown" for an unregistered instance', () => {
      const account = makeAccount({
        username: 'dave',
        acct: 'dave@unknown-instance.example',
      });
      expect(getAreaEngName(account)).toBe('unknown');
    });
  });
});

describe('getAreaShortName', () => {
  describe('local accounts (username === acct)', () => {
    it('returns "未" for area 0 (未設定)', () => {
      const account = makeAccount({
        username: 'alice',
        acct: 'alice',
        area: 0,
      });
      expect(getAreaShortName(account)).toBe('未');
    });

    it('returns "神" for area 1 (kobe)', () => {
      const account = makeAccount({
        username: 'alice',
        acct: 'alice',
        area: 1,
      });
      expect(getAreaShortName(account)).toBe('神');
    });

    it('returns "阪" for area 2 (hanshin)', () => {
      const account = makeAccount({
        username: 'alice',
        acct: 'alice',
        area: 2,
      });
      expect(getAreaShortName(account)).toBe('阪');
    });

    it('falls back to "未" for an undefined area id', () => {
      const account = makeAccount({
        username: 'alice',
        acct: 'alice',
        area: 999,
      });
      expect(getAreaShortName(account)).toBe('未');
    });
  });

  describe('remote accounts (username !== acct)', () => {
    it('returns instance short name for a known instance', () => {
      const account = makeAccount({ username: 'bob', acct: 'bob@pawoo.net' });
      expect(getAreaShortName(account)).toBe('PW');
    });

    it('returns "FD" for fedibird.com', () => {
      const account = makeAccount({
        username: 'carol',
        acct: 'carol@fedibird.com',
      });
      expect(getAreaShortName(account)).toBe('FD');
    });

    it('falls back to "未" for an unregistered instance', () => {
      const account = makeAccount({
        username: 'dave',
        acct: 'dave@unknown-instance.example',
      });
      expect(getAreaShortName(account)).toBe('未');
    });
  });
});
