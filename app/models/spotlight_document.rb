class SpotlightDocument < ApplicationRecord
  belongs_to :parent, class_name: "SpotlightDocument", optional: true
  has_many :children, class_name: "SpotlightDocument", foreign_key: "parent_id"
end
