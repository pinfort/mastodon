# frozen_string_literal: true

class AccountMetadata < ApplicationRecord

  validates :account_id, numericality: { only_integer: true }

  belongs_to :account

  scope :search_users, -> (key, value){ where(key: key, value: value) }
  scope :get_meta_by_account_id, -> (account_id){ where(account_id: account_id) }

end
