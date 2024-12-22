# frozen_string_literal: true

class ProfileMenuComponentPreview < ViewComponent::Preview
  def default
    render(ProfileMenuComponent.new)
  end
end
