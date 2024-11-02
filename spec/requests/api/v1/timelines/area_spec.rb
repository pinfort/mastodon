# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Area' do
  let(:user) { Fabricate(:user) }
  let(:scopes) { 'read:statuses' }
  let(:token) { Fabricate(:accessible_access_token, resource_owner_id: user.id, scopes: scopes) }
  let(:headers) { { 'Authorization' => "Bearer #{token.token}" } }

  describe 'GET /api/v1/timelines/areas/kansai' do
    subject do
      get '/api/v1/timelines/areas/kansai'
    end

    before do
      PostStatusService.new.call(user.account, text: 'It is a kansai.')
    end

    context 'with a user context' do
      it 'returns http success', :aggregate_failures do
        subject
        expect(response).to have_http_status(200)
        expect(response.headers['Link'].links.size).to eq(2)
      end
    end

    context 'without a user context' do
      let(:token) { nil }

      it 'returns http success', :aggregate_failures do
        subject
        expect(response).to have_http_status(200)
        expect(response.headers['Link'].links.size).to eq(2)
      end
    end
  end
end
