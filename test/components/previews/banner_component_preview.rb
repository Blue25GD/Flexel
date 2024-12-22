# frozen_string_literal: true

class BannerComponentPreview < ViewComponent::Preview
  def primary
    render(BannerComponent.new(text: "Primary"))
  end
  def secondary
    render(BannerComponent.new(variant: "secondary", text: "Secondary"))
  end
  def info
    render(BannerComponent.new(variant: "info", text: "info"))
  end
  def danger
    render(BannerComponent.new(variant: "danger", text: "danger"))
  end
  def success
    render(BannerComponent.new(variant: "success", text: "success"))
  end
  def warning
    render(BannerComponent.new(variant: "warning", text: "warning"))
  end
end
