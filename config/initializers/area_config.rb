# frozen_string_literal: true

json_file_path = Rails.root.join('app', 'javascript', 'area_settings.json')
area_settings = File.open(json_file_path) do |f|
  JSON.parse(f.read)
end
Rails.application.config.account_area = area_settings['areas']
Rails.application.config.instances_area = area_settings['instance-areas']

area_hash = {}
Rails.application.config.instances_area.each do |area|
  area_hash[area['group_name']] = area['instances']
end
Rails.application.config.instances_area_hash = area_hash
