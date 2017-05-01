# frozen_string_literal: true
area_settings = YAML.load(
    File.read("#{Rails.root}/config/area_settings.yml")
)
Rails.application.config.account_area = area_settings["areas"]
