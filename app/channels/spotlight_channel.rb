class SpotlightChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_for current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def search_documents(data)
    documents = SpotlightDocument.quick_search(data["query"])

    documents = documents.map do |document|
      {
        id: document.id,
        title: document.title,
        action: document.action,
        has_children: document.children.any?,
        icon: document.icon.nil? ? nil : ActionController::Base.helpers.asset_path(document.icon)
      }
    end

    SpotlightChannel.broadcast_to(
      current_user,
      data: {
        type: "documents",
        values: documents
      }
    )
  end

  def request_documents(data)
    parent_id = data["parent_id"]

    documents = SpotlightDocument.where(parent_id: parent_id)

    documents = documents.map do |document|
      {
        id: document.id,
        title: document.title,
        action: document.action,
        has_children: document.children.any?,
        icon: document.icon.nil? ? nil : ActionController::Base.helpers.asset_path(document.icon)
      }
    end

    SpotlightChannel.broadcast_to(
      current_user,
      data: {
        type: "documents",
        values: documents
      }
    )
  end

  def execute_document(data)
    document = SpotlightDocument.find(data["id"])

    project = Project.find(data["project_id"])

    if project.user != current_user
      return
    end

    # parse the action (JSON)
    if document.action.nil?
      return
    end
    action = JSON.parse(document.action)

    case action["type"]
    when "new_empty_service"
      ActivityLogChannel.broadcast_to(
        current_user,
        data: {
          type: "toast",
          values: {
            type: "neutral",
            message: "Creating service..."
          }
        }
      )

      service = Service.create!(name: Project.generate_project_name, project: project)
      service.paper_trail.save_with_version
      # broadcast the new service
      ServicesChannel.broadcast_services(data["project_id"], current_user)

      ActivityLogChannel.broadcast_to(
        current_user,
        data: {
          type: "toast",
          values: {
            type: "success",
            message: "Service #{service.name} created"
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

    SpotlightChannel.broadcast_to(
      current_user,
      data: {
        type: "execute",
        value: document.action
      }
    )
  end
end
