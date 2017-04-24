# frozen_string_literal: true

class AccountMetaController < ApplicationController
  include AccountControllerConcern

  before_action :authenticate_user!

  def show
    @account.account_metadata.get_meta_by_account_id
  end

  def create
    @account.account_metadata.create(key: key, value: value)
    redirect_to account_path(@account)
  end
end
