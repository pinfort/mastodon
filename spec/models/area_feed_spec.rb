# frozen_string_literal: true

require 'rails_helper'

describe AreaFeed, type: :service do
  describe '#get' do
    let(:account) { Fabricate(:account) }
    let(:instances_remote) { ['example.com'] }
    let(:instances_local) { [nil] }
    let(:instances_both) { [nil, 'example.com'] }
    let(:account_remote) { Fabricate(:account, domain: 'example.com') }
    let(:account_local) { Fabricate(:account, domain: nil) }
    let!(:status_remote) { Fabricate(:status, account: account_remote) }
    let!(:status_local) { Fabricate(:status, account: account_local) }

    it 'can get status in remote domain' do
      results = described_class.new(instances_remote, nil).get(20)
      expect(results).to include status_remote
      expect(results).to_not include status_local
    end

    it 'can get status in local domain' do
      results = described_class.new(instances_local, nil).get(20)
      expect(results).to_not include status_remote
      expect(results).to include status_local
    end

    it 'can get status in both domain' do
      results = described_class.new(instances_both, nil).get(20)
      expect(results).to include status_remote
      expect(results).to include status_local
    end

    it 'can restrict to an account' do
      BlockService.new.call(account, status1.account)
      results = described_class.new(instances_both, account).get(20)
      expect(results).to_not include status_remote
    end

    it 'can restrict to local' do
      status1.account.update(domain: 'example.com')
      status1.update(local: false, uri: 'example.com/toot')
      results = described_class.new(instances_both, nil, local: true).get(20)
      expect(results).to_not include status_remote
    end

    it 'allows replies to be included' do
      original = Fabricate(:status)
      status = Fabricate(:status, in_reply_to_id: original.id)

      results = described_class.new(instances_both, nil, with_replies: true).get(20)
      expect(results).to include(status)
    end
  end
end
