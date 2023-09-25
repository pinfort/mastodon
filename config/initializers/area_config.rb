# frozen_string_literal: true

json_file_path = Rails.root.join("app/javascript/area_settings.json")
area_settings = File.open(json_file_path) do |f|
  JSON.parse(f)
end
Rails.application.config.account_area = area_settings['areas']
Rails.application.config.instances_area = area_settings['instance-areas']

areaHash = {}
Rails.application.config.instances_area.each do |area|
  areaHash[area["group_name"]] = area["instances"]
end
Rails.application.config.instances_area_hash = areaHash
