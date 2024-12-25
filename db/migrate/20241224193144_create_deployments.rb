class CreateDeployments < ActiveRecord::Migration[8.0]
  def change
    create_table :deployments do |t|
      t.references :service, null: false, foreign_key: true
      t.string :status

      t.timestamps
    end
  end
end
