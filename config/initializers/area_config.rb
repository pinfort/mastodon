# frozen_string_literal: true
json_file_path = "#{Rails.root}/app/javascript/area_settings.json"
area_settings = open(json_file_path) do |io|
  JSON.load(io)
end
Rails.application.config.account_area = area_settings["areas"]
Rails.application.config.instances_area = area_settings["instance-areas"]
