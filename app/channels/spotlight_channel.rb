class SpotlightChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_for current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def request_documents(data)
    parent_id = data["parent_id"]

    documents = SpotlightDocument.where(parent_id: parent_id)

    documents = documents.map do |document|
      {
        id: document.id,
        title: document.title,
        action: document.action,
        has_children: document.children.any?
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
end
