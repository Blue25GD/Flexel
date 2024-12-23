class CreateSpotlightDocuments < ActiveRecord::Migration[8.0]
  def change
    create_table :spotlight_documents do |t|
      t.string :title, null: false
      t.string :action, null: false
      t.bigint :parent_id, null: true

      t.timestamps
    end

    add_foreign_key :spotlight_documents, :spotlight_documents, column: :parent_id
  end
end
