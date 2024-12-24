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

    ServicesChannel.broadcast_services(project.id, current_user)

    ActivityLogChannel.broadcast_to(
      current_user,
      data: {
        type: "toast",
        values: {
          type: "success",
          message: "Service #{service.name} deleted"
        }
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

    ServicesChannel.broadcast_services(project.id, current_user)

    ActivityLogChannel.broadcast_to(
      current_user,
      data: {
        type: "toast",
        values: {
          type: "success",
          message: "Service #{service.name} updated"
        }
      }
    )

    ActivityLogChannel.broadcast_to(
      current_user,
      data: {
        type: "changes",
        values: {
          can_deploy: true
        }
      }
    )
  end

  def connect_image(params)
    # set the service's source_url to the image + source_type to docker_image
    service = Service.find(params["service_id"])

    service.source_url = params["image_name"]
    service.source_type = "docker_image"
    service.save!

    ActivityLogChannel.broadcast_to(
      current_user,
      data: {
        type: "changes",
        values: {
          can_deploy: true
        }
      }
    )
  end
end
