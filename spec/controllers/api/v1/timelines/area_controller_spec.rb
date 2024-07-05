# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::Timelines::AreaController do
  render_views

  let(:user) { Fabricate(:user) }
  let(:scopes) { 'read:statuses' }
  let(:token) { Fabricate(:accessible_access_token, resource_owner_id: user.id, scopes: scopes) }

  before do
    allow(controller).to receive(:doorkeeper_token) { token }
  end

  describe 'GET #show' do
    subject do
      get :show, params: { id: 'kansai' }
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
