# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable RSpec/DescribeClass
RSpec.describe 'Area configuration', type: :config do
  it 'loads account areas from hyogo-areas.json' do
    expect(Rails.application.config.account_area).to be_an(Array)
    expect(Rails.application.config.account_area.length).to eq(9)
  end

  it 'loads instances_area_hash from area-timelines.json' do
    expect(Rails.application.config.instances_area_hash).to be_a(Hash)
    expect(Rails.application.config.instances_area_hash.keys).to include('hyogo', 'kansai', 'bestfriends')
  end

  it 'correctly maps timeline instances' do
    expect(Rails.application.config.instances_area_hash['kansai']).to include(nil, 'mastodos.com', 'minohdon.jp')
  end
end
# rubocop:enable RSpec/DescribeClass
