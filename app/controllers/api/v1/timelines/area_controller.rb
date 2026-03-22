# frozen_string_literal: true

class Api::V1::Timelines::AreaController < Api::V1::Timelines::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:statuses' }
  before_action :require_user!, if: :require_auth?
  before_action :load_area

  PERMITTED_PARAMS = %i(local limit only_media).freeze

  def show
    cache_if_unauthenticated!
    @statuses = load_statuses
    render json: @statuses, each_serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new(@statuses, current_user&.account_id)
  end

  private

  def require_auth?
    Setting.local_live_feed_access != 'public' || Setting.remote_live_feed_access != 'public'
  end

  def load_area
    areas = Rails.application.config.instances_area_hash

    @instances = areas[params[:id].downcase]
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
    api_v1_timelines_area_url params[:id], next_path_params
  end

  def prev_path
    api_v1_timelines_area_url params[:id], prev_path_params
  end
end
