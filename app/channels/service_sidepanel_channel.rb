class ServiceSidepanelChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def request_service(params)
    service = Service.find(params["service_id"])

    # check if the user has access to the service
    if service.project.user != current_user
      return
    end

    ServiceSidepanelChannel.broadcast_to(
      current_user,
      data: {
        type: "service",
        values: [{
          id: service.id,
          name: service.name,
        }]
      }
    )
  end

  def delete_service(params)
    service = Service.find(params["service_id"])

    # check if the user has access to the service
    if service.project.user != current_user
      return
    end
    project = service.project

    service.destroy

    ServiceSidepanelChannel.broadcast_to(
      current_user,
      data: {
        type: "service_deleted",
        values: [{
          id: service.id,
        }]
      }
    )

    services = Service.where(project_id: project.id)

    services = services.map do |current_service|
      {
        id: current_service.id,
        name: current_service.name
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

  def update_service_name(params)
    service = Service.find(params["service_id"])

    # check if the user has access to the service
    if service.project.user != current_user
      return
    end
    project = service.project

    service.update(name: params["name"])

    ServiceSidepanelChannel.broadcast_to(
      current_user,
      data: {
        type: "service",
        values: [{
          id: service.id,
          name: service.name,
        }]
      }
    )

    services = Service.where(project_id: project.id)

    services = services.map do |current_service|
      {
        id: current_service.id,
        name: current_service.name
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
