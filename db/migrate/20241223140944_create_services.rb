class CreateServices < ActiveRecord::Migration[8.0]
  def change
    create_table :services do |t|
      t.string :name, null: false
      t.references :project, null: false, foreign_key: true

      t.string :source_type, null: true
      t.string :source_url, null: true

      t.timestamps
    end
  end
end
