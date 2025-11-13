# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AreaFeed, type: :service do
  describe '#get' do
    let(:account) { Fabricate(:account) }
    let(:instances_remote) { ['example.com'] }
    let(:instances_local) { [nil] }
    let(:instances_both) { [nil, 'example.com'] }
    let(:instances_multiple) { [nil, 'example.com', 'example2.com'] }
    let(:account_remote) { Fabricate(:account, domain: 'example.com') }
    let(:account_remote2) { Fabricate(:account, domain: 'example2.com') }
    let(:account_local) { Fabricate(:account, domain: nil) }
    let(:account_local2) { Fabricate(:account, domain: nil) }
    let!(:status_remote) { Fabricate(:status, account: account_remote) }
    let!(:status_remote2) { Fabricate(:status, account: account_remote2) }
    let!(:status_local) { Fabricate(:status, account: account_local) }

    context 'with domain filtering' do
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

      it 'can get status from multiple domains' do
        results = described_class.new(instances_multiple, nil).get(20)
        expect(results).to include status_remote
        expect(results).to include status_remote2
        expect(results).to include status_local
      end

      it 'returns empty array for empty instances array' do
        results = described_class.new([], nil).get(20)
        expect(results).to be_empty
      end
    end

    context 'with local/remote filtering' do
      before do
        status_remote.account.update(domain: 'example.com')
        status_remote.update(local: false, uri: 'example.com/toot')
      end

      it 'can restrict to local' do
        results = described_class.new(instances_both, nil, local: true).get(20)
        expect(results).to_not include status_remote
        expect(results).to include status_local
      end

      it 'can restrict to remote' do
        results = described_class.new(instances_both, nil, remote: true).get(20)
        expect(results).to include status_remote
        expect(results).to_not include status_local
      end
    end

    context 'with reply filtering' do
      let!(:original) { Fabricate(:status, account: account_local) }
      let!(:reply) { Fabricate(:status, account: account_local2, in_reply_to_id: original.id) }

      it 'excludes replies by default' do
        results = described_class.new(instances_local, nil).get(20)
        expect(results).to include status_local
        expect(results).to_not include reply
      end

      it 'allows replies to be included' do
        results = described_class.new(instances_local, nil, with_replies: true).get(20)
        expect(results).to include status_local
        expect(results).to include reply
      end
    end

    context 'with reblog filtering' do
      let!(:original_status) { Fabricate(:status, account: account_local) }
      let!(:reblog) { Fabricate(:status, account: account_local, reblog_of_id: original_status.id) }

      it 'can include reblogs' do
        results = described_class.new(instances_local, nil, with_reblogs: true).get(20)
        expect(results).to include reblog
      end

      it 'excludes reblogs by default' do
        results = described_class.new(instances_local, nil).get(20)
        expect(results).to include status_local
        expect(results).to_not include reblog
      end
    end

    context 'with media filtering' do
      let!(:status_with_media) { Fabricate(:status, account: account_local) }
      let(:media_attachment) { Fabricate(:media_attachment, account: account_local, status: status_with_media) }

      it 'includes all statuses by default' do
        results = described_class.new(instances_local, nil).get(20)
        expect(results).to include status_local
        expect(results).to include status_with_media
      end

      it 'can restrict to only media' do
        media_attachment # Ensure media attachment exists
        results = described_class.new(instances_local, nil, only_media: true).get(20)
        expect(results).to_not include status_local
        expect(results).to include status_with_media
      end
    end

    context 'with pagination' do
      let!(:older_status) { Fabricate(:status, account: account_local, created_at: 2.days.ago) }
      let!(:newer_status) { Fabricate(:status, account: account_local, created_at: 1.day.ago) }

      it 'respects limit parameter' do
        results = described_class.new(instances_local, nil).get(1)
        expect(results.size).to eq(1)
      end

      it 'respects max_id parameter' do
        results = described_class.new(instances_local, nil).get(20, newer_status.id)
        expect(results).to include older_status
        expect(results).to_not include newer_status
      end

      it 'respects since_id parameter' do
        results = described_class.new(instances_local, nil).get(20, nil, older_status.id)
        expect(results).to include newer_status
        expect(results).to_not include older_status
      end

      it 'respects min_id parameter' do
        results = described_class.new(instances_local, nil).get(20, nil, nil, older_status.id)
        expect(results).to include newer_status
      end
    end

    # it 'can restrict to an account' do
    #   BlockService.new.call(account, status_remote.account)
    #   results = described_class.new(instances_both, account).get(20)
    #   expect(results).to_not include status_remote
    # end
  end
end
