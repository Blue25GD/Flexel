class ServicesChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_for current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def request_services(data)
    services = Service.where(project_id: params[:project_id])

    services = services.map do |service|
      {
        id: service.id,
        name: service.name
      }
    end

    ServicesChannel.broadcast_to(
      current_user,
      data: {
        type: "services",
        values: services
      }
    )
  end
end
