# frozen_string_literal: true

class ButtonComponentPreview < ViewComponent::Preview
  def red
    @color = "red"
    render(ButtonComponent.new(color: @color, text: "Click me"))
  end

  def blue
    @color = "blue"
    render(ButtonComponent.new(color: @color, text: "Click me"))
  end

  def green
    @color = "green"
    render(ButtonComponent.new(color: @color, text: "Click me"))
  end

  def pink
    @color = "pink"
    render(ButtonComponent.new(color: @color, text: "Click me"))
  end

  def gray
    @color = "gray"
    render(ButtonComponent.new(color: @color, text: "Click me"))
  end
end
