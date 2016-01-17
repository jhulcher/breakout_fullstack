class CreateScores < ActiveRecord::Migration
  def change
    create_table :scores do |t|
      t.string :name, null: false
      t.integer :num, null: false
      t.integer :level, null: false
      t.timestamps null: false
    end
    add_index :scores, :num
  end
end
