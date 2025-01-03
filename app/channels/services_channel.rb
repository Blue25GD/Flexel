class ServicesChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_for current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def request_services
    ServicesChannel.broadcast_services(params["project_id"], current_user)
  end

  def self.broadcast_services(project_id, user)
    project_id = project_id.to_i
    services = Service.where(project_id: project_id)

    services = services.map do |service|
      {
        id: service.id,
        name: service.name
      }
    end

    ServicesChannel.broadcast_to(
      user,
      data: {
        type: "services",
        values: services
      }
    )
  end
end
