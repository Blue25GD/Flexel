# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# add the spotlight_documents

new_service = SpotlightDocument.new(title: "New Service", icon: "plus.svg")
new_service.save!
SpotlightDocument.create!(title: "Docker Image", icon: "cube.svg", parent: new_service)
SpotlightDocument.create!(title: "Empty Service", icon: "empty-project.svg", parent: new_service, action: '{"type":"new_empty_service"}')
