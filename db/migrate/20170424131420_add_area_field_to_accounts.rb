# frozen_string_literal: true

class AddAreaFieldToAccounts < ActiveRecord::Migration[5.0]
  def change
    add_column :accounts, :area, :integer, null: false, default: 0
    add_index :accounts, [:area], unique: false
  end
end
