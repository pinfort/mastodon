require 'rails_helper'

describe AreaFeed, type: :service do
  describe '#get' do
    let(:account) { Fabricate(:account) }
    let(:instances_remote) { Fabricate(['example.com']) }
    let(:instances_local) { Fabricate([nil]) }
    let(:instances_both) { Fabricate([nil, 'example.com']) }
    let(:account_remote) { Fabricate(:account, domain: 'example.com') }
    let(:account_local) { Fabricate(:account, domain: nil) }
    let!(:status1) { Fabricate(:status, account: account_remote) }
    let!(:status2) { Fabricate(:status, account: account_local) }

    it 'can get status in remote domain' do
      results = described_class.new(instances_remote, nil).get(20)
      expect(results).to include status1
      expect(results).to_not include status2
    end

    it 'can get status in local domain' do
      results = described_class.new(instances_local, nil).get(20)
      expect(results).to_not include status1
      expect(results).to include status2
    end

    it 'can get status in both domain' do
      results = described_class.new(instances_both, nil).get(20)
      expect(results).to include status1
      expect(results).to include status2
    end

    it 'can restrict to an account' do
      BlockService.new.call(account, status1.account)
      results = described_class.new(instances_both, account).get(20)
      expect(results).to_not include status1
    end

    it 'can restrict to local' do
      status1.account.update(domain: 'example.com')
      status1.update(local: false, uri: 'example.com/toot')
      results = described_class.new(instances_both, nil, local: true).get(20)
      expect(results).to_not include status1
    end

    it 'allows replies to be included' do
      original = Fabricate(:status)
      status = Fabricate(:status, in_reply_to_id: original.id)

      results = described_class.new(instances_both, nil).get(20)
      expect(results).to include(status)
    end
  end
end
