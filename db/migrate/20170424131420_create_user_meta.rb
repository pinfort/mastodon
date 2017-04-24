class CreateUserMeta < ActiveRecord::Migration
  def change
    create_table :users_meta do |t|
      t.string :username, null: false, default: ''
      t.string :domain, null: true

      # data column
      t.string :key, null: false, default: ''
      t.string :value, null: false, default: ''

      t.timestamps null: false
    end

    add_index :users_meta, [:username, :domain], unique: true
    add_index :users_meta, [:key, :value], unique: false
  end
end
