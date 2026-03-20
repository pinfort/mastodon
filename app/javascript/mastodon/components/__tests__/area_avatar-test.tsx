import { render } from '@testing-library/react';

import type { Account } from 'mastodon/models/account';

import { AreaAvatar } from '../area_avatar';

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

describe('<AreaAvatar />', () => {
  it('renders wrapper div with correct class', () => {
    const account = makeAccount({ username: 'alice', acct: 'alice', area: 1 });
    const { container } = render(<AreaAvatar account={account} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the area eng name as inner class for a local account', () => {
    const account = makeAccount({ username: 'alice', acct: 'alice', area: 1 });
    const { container } = render(<AreaAvatar account={account} />);
    const wrapper = container.firstChild as HTMLElement;
    const inner = wrapper.firstChild as HTMLElement;

    expect(wrapper.className).toBe('account__avatar__area-wrapper');
    expect(inner.className).toBe('account__avatar__area-kobe');
  });

  it('renders the area short name as text for a local account', () => {
    const account = makeAccount({ username: 'alice', acct: 'alice', area: 1 });
    const { container } = render(<AreaAvatar account={account} />);
    const inner = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement;

    expect(inner.textContent).toBe('神');
  });

  it('uses "unknown" class and "未" text for area 0 (未設定)', () => {
    const account = makeAccount({ username: 'alice', acct: 'alice', area: 0 });
    const { container } = render(<AreaAvatar account={account} />);
    const inner = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement;

    expect(inner.className).toBe('account__avatar__area-unknown');
    expect(inner.textContent).toBe('未');
  });

  it('uses "unknown" class for an unrecognised area id', () => {
    const account = makeAccount({
      username: 'alice',
      acct: 'alice',
      area: 999,
    });
    const { container } = render(<AreaAvatar account={account} />);
    const inner = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement;

    expect(inner.className).toBe('account__avatar__area-unknown');
  });

  it('renders instance eng name class for a remote account', () => {
    const account = makeAccount({ username: 'bob', acct: 'bob@pawoo.net' });
    const { container } = render(<AreaAvatar account={account} />);
    const inner = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement;

    expect(inner.className).toBe('account__avatar__area-remote-pawoo');
    expect(inner.textContent).toBe('PW');
  });

  it('falls back to "unknown" for an unregistered remote instance', () => {
    const account = makeAccount({
      username: 'dave',
      acct: 'dave@unknown-instance.example',
    });
    const { container } = render(<AreaAvatar account={account} />);
    const inner = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement;

    expect(inner.className).toBe('account__avatar__area-unknown');
    expect(inner.textContent).toBe('未');
  });
});
