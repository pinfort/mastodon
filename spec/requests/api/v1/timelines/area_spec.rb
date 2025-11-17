# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Area' do
  let(:user) { Fabricate(:user) }
  let(:scopes) { 'read:statuses' }
  let(:token) { Fabricate(:accessible_access_token, resource_owner_id: user.id, scopes: scopes) }
  let(:headers) { { 'Authorization' => "Bearer #{token.token}" } }

  describe 'GET /api/v1/timelines/area/:id' do
    before do
      PostStatusService.new.call(user.account, text: 'It is a test status.')
    end

    context 'with valid area name' do
      subject do
        get '/api/v1/timelines/area/kansai', headers: headers
      end

      context 'with a user context' do
        it 'returns http success', :aggregate_failures do
          subject
          expect(response).to have_http_status(200)
          expect(response).to include_pagination_headers(
            prev: api_v1_timelines_area_url(min_id: user.account.statuses.first.id),
            next: api_v1_timelines_area_url(max_id: user.account.statuses.first.id)
          )
          expect(response.content_type)
            .to start_with('application/json')
        end

        it 'returns statuses' do
          subject
          expect(response.parsed_body.size).to be > 0
        end
      end

      context 'without a user context' do
        let(:token) { nil }

        it 'returns http success', :aggregate_failures do
          get '/api/v1/timelines/area/kansai'
          expect(response).to have_http_status(200)
          expect(response).to include_pagination_headers(
            prev: api_v1_timelines_area_url(min_id: user.account.statuses.first.id),
            next: api_v1_timelines_area_url(max_id: user.account.statuses.first.id)
          )
          expect(response.content_type)
            .to start_with('application/json')
        end
      end
    end

    context 'with different area names' do
      %w(hyogo kansai bestfriends mstdnjp pawoo).each do |area_name|
        it "returns success for area: #{area_name}" do
          get "/api/v1/timelines/area/#{area_name}", headers: headers
          expect(response).to have_http_status(200)
          expect(response.content_type).to start_with('application/json')
        end
      end
    end

    context 'with invalid area name' do
      it 'returns empty result for unknown area' do
        get '/api/v1/timelines/area/nonexistent', headers: headers
        expect(response).to have_http_status(200)
        expect(response.parsed_body).to eq([])
      end
    end

    context 'with query parameters' do
      let(:remote_account) { Fabricate(:account, domain: 'example.com') }
      let!(:remote_status) { Fabricate(:status, account: remote_account) }

      before do
        remote_status.update(local: false, uri: 'example.com/toot')
      end

      it 'respects local parameter' do
        get '/api/v1/timelines/area/kansai', params: { local: true }, headers: headers
        expect(response).to have_http_status(200)
      end

      it 'respects only_media parameter' do
        get '/api/v1/timelines/area/kansai', params: { only_media: true }, headers: headers
        expect(response).to have_http_status(200)
      end

      it 'respects limit parameter' do
        get '/api/v1/timelines/area/kansai', params: { limit: 5 }, headers: headers
        expect(response).to have_http_status(200)
        expect(response.parsed_body.size).to be <= 5
      end
    end

    context 'with pagination parameters' do
      let!(:older_status) { Fabricate(:status, account: user.account, created_at: 2.days.ago) }
      let!(:newer_status) { Fabricate(:status, account: user.account, created_at: 1.day.ago) }

      it 'respects max_id parameter' do
        get '/api/v1/timelines/area/kansai', params: { max_id: newer_status.id }, headers: headers
        expect(response).to have_http_status(200)
      end

      it 'respects since_id parameter' do
        get '/api/v1/timelines/area/kansai', params: { since_id: older_status.id }, headers: headers
        expect(response).to have_http_status(200)
      end

      it 'respects min_id parameter' do
        get '/api/v1/timelines/area/kansai', params: { min_id: older_status.id }, headers: headers
        expect(response).to have_http_status(200)
      end
    end

    context 'with case insensitive area name' do
      it 'accepts uppercase area name' do
        get '/api/v1/timelines/area/KANSAI', headers: headers
        expect(response).to have_http_status(200)
      end

      it 'accepts mixed case area name' do
        get '/api/v1/timelines/area/Kansai', headers: headers
        expect(response).to have_http_status(200)
      end
    end
  end
end
