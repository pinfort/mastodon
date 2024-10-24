# frozen_string_literal: true

class Api::V1::Timelines::AreaController < Api::V1::Timelines::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:statuses' }
  before_action :load_area

  PERMITTED_PARAMS = %i(local limit only_media).freeze

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
    preloaded_area_statuses
  end

  def preloaded_area_statuses
    @instances.nil? ? [] : preload_collection(area_timeline_statuses, Status)
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

  def next_path
    api_v1_timelines_area_url params[:id], pagination_params(max_id: pagination_max_id)
  end

  def prev_path
    api_v1_timelines_area_url params[:id], pagination_params(since_id: pagination_since_id)
  end
end
