# frozen_string_literal: true

class SpotlightComponent < ViewComponent::Base
  def initialize(project: nil, documents: [])
    @project = project

    @documents = SpotlightDocument.where(parent_id: nil)
  end
end
