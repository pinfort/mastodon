# frozen_string_literal: true

module AccountAreaHelper
  json_file_path = "#{Rails.root}/app/assets/javascripts/area_settings.json"
  conf = open(json_file_path) do |io|
    JSON.load(io)
  end
  HUMAN_AREAS = conf["areas"]

  def human_area(area_id)
    HUMAN_AREAS[area_id]["area-name"]
  end

  def get_area_eng_name(area_id)
    HUMAN_AREAS[area_id]["area-eng-name"]
  end

  def get_area_short_name(area_id)
    HUMAN_AREAS[area_id]["area-short-name"]
  end

  def area_id_list
    Array(0...HUMAN_AREAS.length)
  end

end
