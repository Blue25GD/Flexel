class AddDeployedVersionToServices < ActiveRecord::Migration[8.0]
  def change
    add_column :services, :deployed_version, :bigint
    add_foreign_key :services, :versions, column: :deployed_version, primary_key: :id
  end
end
