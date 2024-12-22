# frozen_string_literal: true

class ButtonComponent < ViewComponent::Base
  def initialize(color: 'gray', ghost: false, text:, classes: "", **options)
    @color = color
    @text = text
    @options = options
    @ghost = ghost
    @class = classes
  end
end
