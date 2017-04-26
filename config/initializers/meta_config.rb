# frozen_string_literal: true
meta_settings = YAML.load(
    File.read("#{Rails.root}/config/meta_settings.yml")
)
Rails.application.config.account_meta = meta_settings
