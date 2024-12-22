# frozen_string_literal: true

class BannerComponent < ViewComponent::Base
  def initialize(variant: "primary", text:)
    @variant = variant
    @text = text
  end
end
