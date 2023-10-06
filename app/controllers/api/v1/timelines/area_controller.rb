# frozen_string_literal: true

class Api::V1::Timelines::AreaController < Api::BaseController
  before_action -> { doorkeeper_authorize! :read, :'read:statuses' }, only: [:show], if: :require_auth?
  before_action :load_area
  after_action :insert_pagination_headers, unless: -> { @statuses.empty? }

  def show
    cache_if_unauthenticated!
    @statuses = load_statuses
    render json: @statuses, each_serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new(@statuses, current_user&.account_id)
  end

  private

  def require_auth?
    !Setting.timeline_preview
  end

  def load_area
    areas = {}
    Rails.application.config.instances_area.each do |value|
      areas[value['group_name']] = value['instances']
    end

    # rubocop:disable Style/EmptyElse
    @instances = if areas.key?(params[:id].downcase)
                   areas[params[:id].downcase]
                 else
                   nil
                 end
    # rubocop:enable Style/EmptyElse
  end

  def load_statuses
    cached_area_statuses
  end

  def cached_area_statuses
    @instances.nil? ? [] : cache_collection(area_timeline_statuses, Status)
  end

  def area_timeline_statuses
    area_feed.get(
      limit_param(DEFAULT_STATUSES_LIMIT),
      params[:max_id],
      params[:since_id],
      params[:min_id]
    )
  end

  def area_feed
    AreaFeed.new(
      @instances,
      current_account,
      local: truthy_param?(:local),
      remote: truthy_param?(:remote),
      only_media: truthy_param?(:only_media)
    )
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def pagination_params(core_params)
    params.slice(:local, :remote, :limit, :only_media).permit(:local, :remote, :limit, :only_media).merge(core_params)
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
