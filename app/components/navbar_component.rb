# frozen_string_literal: true

class NavbarComponent < ViewComponent::Base
  def initialize(project: nil)
    @project = project
  end
end
