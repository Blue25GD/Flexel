class SpotlightDocument < ApplicationRecord
  belongs_to :parent, class_name: "SpotlightDocument", optional: true
  has_many :children, class_name: "SpotlightDocument", foreign_key: "parent_id"

  def self.quick_search(query)
    terms = query.split.map { |term| sanitize_sql_like(term.downcase) }
    where(terms.map { |term| "LOWER(title) LIKE ?" }.join(" AND "), *terms.map { |t| "%#{t}%" })
  end
end
