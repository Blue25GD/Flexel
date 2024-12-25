class ActivityLogChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def can_deploy(params)
    project = Project.find(params["project_id"])

    if project.user != current_user
      return
    end

    # check if any services have a newer version available that isn't their latest deployed version
    result = false

    services = Service.where(project_id: project.id)

    services.each do |service|
      last_version = service.versions.last

      # x - 1 since updating the last deployed version increments the versions by 1
      if last_version && last_version.id != service.deployed_version
        result = true
        break
      end

    end

    ActivityLogChannel.broadcast_to(
      current_user,
      data: {
        type: "changes",
        values: {
          can_deploy: result
        }
      }
    )
  end

  def discard_changes(params)
    project = Project.find(params["project_id"])

    if project.user != current_user
      return
    end

    services = Service.where(project_id: project.id)

    services.each do |service|
      # if the deployed version is nil -> destroy that service
      if service.deployed_version.nil?
        service.destroy
        next
      end

      # restore the service to the last deployed version
      version = PaperTrail::Version.find(service.deployed_version).reify

      if version.nil?
        service.destroy
        next
      end

      service.name = version.name
      service.source_type = version.source_type
      service.source_url = version.source_url
      service.save!

      service.versions.where("id > ?", service.deployed_version).destroy_all
    end

    ActivityLogChannel.broadcast_to(
      current_user,
      data: {
        type: "changes",
        values: {
          can_deploy: false
        }
      }
    )

    ServicesChannel.broadcast_services(project.id, current_user)
  end

  def deploy_changes(params)
    project = Project.find(params["project_id"])

    if project.user != current_user
      return
    end

    services = Service.where(project_id: project.id)

    services.each do |service|
      last_version = service.versions.last
      service.deployed_version = last_version.id
      service.save!
    end

    ActivityLogChannel.broadcast_to(
      current_user,
      data: {
        type: "changes",
        values: {
          can_deploy: false
        }
      }
    )

    ServicesChannel.broadcast_services(project.id, current_user)
  end
end
