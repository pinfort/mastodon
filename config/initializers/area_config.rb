# frozen_string_literal: true

json_file_path = Rails.root.join('app', 'javascript', 'hyogo-areas.json')
Rails.application.config.account_area = File.open(json_file_path) do |f|
  JSON.parse(f.read)['areas']
end

json_file_path = Rails.root.join('app', 'javascript', 'area-timelines.json')
timelines = File.open(json_file_path) do |f|
  JSON.parse(f.read)
end
Rails.application.config.instances_area_hash = timelines.transform_values { |val| val['instances'] }
