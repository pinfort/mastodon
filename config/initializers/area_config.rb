# frozen_string_literal: true
json_file_path = "#{Rails.root}/app/assets/javascripts/area_settings.json"
area_settings = open(json_file_path) do |io|
  JSON.load(io)
end
Rails.application.config.account_area = area_settings["areas"]
