# frozen_string_literal: true

hyogo_areas_path = Rails.root.join('app', 'javascript', 'hyogo-areas.json')
Rails.application.config.account_area = File.open(hyogo_areas_path) do |f|
  JSON.parse(f.read)['areas']
end

area_timelines_path = Rails.root.join('app', 'javascript', 'area-timelines.json')
timelines = File.open(area_timelines_path) do |f|
  JSON.parse(f.read)
end
Rails.application.config.instances_area_hash = timelines.transform_values { |val| val['instances'] }
