# frozen_string_literal: true

class SpotlightComponentPreview < ViewComponent::Preview
  def default
    render(SpotlightComponent.new)
  end
end
