import {Controller} from "@hotwired/stimulus"
import consumer from "channels/consumer"

// Connects to data-controller="spotlight"
export default class extends Controller {
    static targets = ["documentTemplate", "results", "notFound"]

    channel = null
    response_ready = true

    hide(event) {
        // if it's a keyboard event, we only want to hide if the key was escape
        if (event instanceof KeyboardEvent && event.key !== "Escape") {
            return
        }

        document.getElementById("spotlight").style.display = "none";
        this.requestRoot();
    }

    requestRoot() {
        this.channel.perform('request_documents', {parent_id: null})
        this.response_ready = false
    }

    search(event) {
        const query = event.target.value
        if (query.length === 0) {
            this.requestRoot()
            return
        }

        this.channel.perform('search_documents', {query: query})
        this.response_ready = false
    }

    connect() {
        // use the spotlight channel
        this.channel = consumer.subscriptions.create("SpotlightChannel", {
            connected: () => {
                this.requestRoot()
            },

            disconnected() {
                // Called when the subscription has been terminated by the server
            },

            received: (data) => {
                this.response_ready = true
                data = data.data
                const values = data.values
                switch (data.type) {
                    case "documents":
                        // render the documents
                        this.resultsTarget.innerHTML = ""

                        // if there are no documents, show the not found message
                        if (values.length === 0) {
                            let clone = this.notFoundTarget.cloneNode(true)
                            clone.style.display = "flex"
                            this.resultsTarget.appendChild(clone)
                            return
                        }

                        for (const value of values) {
                            const document = this.documentTemplateTarget.cloneNode(true)
                            document.querySelector("span").textContent = value.title
                            document.querySelector(".arrow-icon-container").hidden = !value.has_children
                            if (value.icon) {
                                document.querySelector(".icon-container .icon").src = value.icon
                            } else {
                                document.querySelector(".icon-container .icon").style.display = "none"
                            }

                            document.style.display = "flex"

                            if (value.has_children) {
                                document.addEventListener("click", (event) => {
                                    event.preventDefault()
                                    this.channel.perform("request_documents", {parent_id: value.id})
                                    this.response_ready = false
                                })
                            } else {
                                document.addEventListener("click", (event) => {
                                    let project_id = window.location.pathname.split("/")[2]

                                    this.channel.perform("execute_document", {id: value.id, project_id: project_id})
                                })
                            }

                            this.resultsTarget.appendChild(document)
                        }

                        break
                    case "execute":
                        // close spotlight
                        this.hide(null)
                        break
                }
            }
        });
    }

    disconnect() {
        this.channel.unsubscribe()
    }
}
