class CreateUserMeta < ActiveRecord::Migration
  def change
    create_table :user_metadata do |t|
      t.integer :account_id, null: false

      # data column
      t.string :key, null: false, default: ''
      t.string :value, null: false, default: ''

      t.timestamps null: false
    end

    add_index :user_metadata, [:username, :domain], unique: true
    add_index :user_metadata, [:key, :value], unique: false
  end
end
