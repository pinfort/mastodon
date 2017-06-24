# frozen_string_literal: true

class Api::V1::Timelines::AreaController < Api::BaseController
  before_action :load_area
  after_action :insert_pagination_headers, unless: -> { @statuses.empty? }

  respond_to :json

  def show
    @statuses = load_statuses
    render 'api/v1/timelines/show'
  end

  private

  def load_area
    areas = {}
    Rails.application.config.instances_area.map do |key, value|
      areas[option.group_name] = option.instances
    end
    if areas.has_key?(params[:id].downcase)
      @instances = areas[params[:id].downcase]["instances"]
    else
      @instances = nil
    end
  end

  def load_statuses
    cached_area_statuses.tap do |statuses|
      set_maps(statuses)
    end
  end

  def cached_area_statuses
    cache_collection area_statuses, Status
  end

  def area_statuses
    if @instances.nil?
      []
    else
      area_timeline_statuses.paginate_by_max_id(
        limit_param(DEFAULT_STATUSES_LIMIT),
        params[:max_id],
        params[:since_id]
      )
    end
  end

  def area_timeline_statuses
    Status.as_area_timeline(@instances, current_account, params[:local])
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def pagination_params(core_params)
    params.permit(:local, :limit).merge(core_params)
  end

  def next_path
    api_v1_timelines_area_url params[:id], pagination_params(max_id: pagination_max_id)
  end

  def prev_path
    api_v1_timelines_area_url params[:id], pagination_params(since_id: pagination_since_id)
  end

  def pagination_max_id
    @statuses.last.id
  end

  def pagination_since_id
    @statuses.first.id
  end
end
