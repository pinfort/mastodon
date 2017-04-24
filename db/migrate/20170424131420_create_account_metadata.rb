class CreateAccountMetadata < ActiveRecord::Migration
  def change
    create_table :account_metadata do |t|
      t.integer :account_id, null: false

      # data column
      t.string :key, null: false, default: ''
      t.string :value, null: false, default: ''

      t.timestamps null: false
    end

    add_index :account_metadata, [:username, :domain], unique: true
    add_index :account_metadata, [:key, :value], unique: false
  end
end
