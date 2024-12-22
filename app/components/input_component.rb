# frozen_string_literal: true

class InputComponent < ViewComponent::Base
  def initialize(name:, label:, type: "text", placeholder: nil, value: nil, error: nil, **options)
    @name = name
    @label = label
    @type = type
    @placeholder = placeholder
    @value = value
    @error = error
    @options = options
  end
end
