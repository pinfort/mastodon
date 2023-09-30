# frozen_string_literal: true

module AccountAreaHelper
  json_file_path = Rails.root.join('app', 'javascript', 'area_settings.json')
  conf = File.open(json_file_path) do |io|
    JSON.parse(io.read)
  end
  HUMAN_AREAS = conf['areas']
  HUMAN_AREAS.freeze
  HUMAN_AREA_IDS = {}
  HUMAN_AREAS.each do |area|
    HUMAN_AREA_IDS[area['area-id']] = area
  end
  HUMAN_AREA_IDS.freeze

  def human_area(area_id)
    HUMAN_AREA_IDS[area_id]['area-name']
  end

  def get_area_eng_name(area_id)
    HUMAN_AREA_IDS[area_id]['area-eng-name']
  end

  def get_area_short_name(area_id)
    HUMAN_AREA_IDS[area_id]['area-short-name']
  end

  def get_area_id_from_area_no(area_no)
    HUMAN_AREAS[area_no]['area-id']
  end

  def area_id_list
    HUMAN_AREA_IDS.keys
  end
end
