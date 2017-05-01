class AddAreaFieldToAccounts < ActiveRecord::Migration
  def change
    add_column :accounts, :area, :integer, null: false, default: 0
    add_index :accounts, [:area], unique: false
  end
end
