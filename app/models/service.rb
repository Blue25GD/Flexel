class Service < ApplicationRecord
  has_paper_trail ignore: [:deployed_version]

  belongs_to :project

  validates :source_type, inclusion: { in: %w[github_repo docker_image], allow_nil: true }
  validate :both_or_none_present

  private

  def both_or_none_present
    if source_type.present? ^ source_url.present? # XOR logic: true if only one is present
      errors.add(:base, "Both source_type and source url must be present, or both must be null")
    end
  end
end
