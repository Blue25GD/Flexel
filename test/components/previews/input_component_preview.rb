# frozen_string_literal: true
class InputComponentPreview < ViewComponent::Preview
  # Preview: Only name and label
  def name_and_label
    render(InputComponent.new(name: "name", label: "Label"))
  end

  # Preview: Name, label, and value
  def name_label_and_value
    render(InputComponent.new(name: "name", label: "Label", value: "Some value"))
  end

  # Preview: Name, label, and placeholder
  def name_label_and_placeholder
    render(InputComponent.new(name: "name", label: "Label", placeholder: "Some placeholder"))
  end

  # Preview: Name, label, and error
  def name_label_and_error
    render(InputComponent.new(name: "name", label: "Label", error: "This field is required"))
  end

  # Preview: Name, label, placeholder, and error
  def name_label_placeholder_and_error
    render(InputComponent.new(name: "name", label: "Label", placeholder: "Some placeholder", error: "This field is required"))
  end

  # Preview: Name, label, value, and error
  def name_label_value_and_error
    render(InputComponent.new(name: "name", label: "Label", value: "Some value", error: "This field is required"))
  end
end
