# frozen_string_literal: true

module AccountAreaHelper
  yaml = YAML.load_file("#{Rails.root}/config/area_settings.yml")
  HUMAN_AREAS = yaml["areas"]

  def human_area(area_id)
    HUMAN_AREAS[area_id]
  end

  def area_id_list
    Array(0...HUMAN_AREAS.length)
  end

end
