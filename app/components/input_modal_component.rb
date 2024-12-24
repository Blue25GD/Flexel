# frozen_string_literal: true

class InputModalComponent < ViewComponent::Base
  def initialize(modal_id:, label: "Edit service name", placeholder: "Enter new value")
    @modal_id = modal_id
    @label = label
    @placeholder = placeholder
  end
end
