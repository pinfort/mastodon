# frozen_string_literal: true

describe 'Area url shown' do
  describe 'with no area id' do
    it 'shows page' do
      get '/areas'

      expect(response).to have_http_status(200)
    end
  end

  describe 'with area id' do
    it 'shows page' do
      get '/areas/foofoo'

      expect(response).to have_http_status(200)
    end
  end
end
