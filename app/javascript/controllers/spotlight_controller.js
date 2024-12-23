import {Controller} from "@hotwired/stimulus"
import consumer from "channels/consumer"

// Connects to data-controller="spotlight"
export default class extends Controller {
    static targets = ["documentTemplate", "results"]

    channel = null
    response_ready = true

    interval = null

    hide() {
        document.getElementById("spotlight").style.display = "none";
        this.requestRoot();
    }

    requestRoot() {
        this.channel.perform('request_documents', {parent_id: null})
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
                        console.log("Received documents", values)

                        this.resultsTarget.innerHTML = ""

                        for (const value of values) {
                            const document = this.documentTemplateTarget.cloneNode(true)
                            document.querySelector("span").textContent = value.title
                            document.querySelector(".icon-container").hidden = !value.has_children

                            document.style.display = "flex"

                            if (value.has_children) {
                                document.addEventListener("click", (event) => {
                                    event.preventDefault()
                                    this.channel.perform("request_documents", {parent_id: value.id})
                                    this.response_ready = false
                                })
                            }

                            this.resultsTarget.appendChild(document)
                        }

                        break
                }
            }
        });
    }

    disconnect() {
        this.channel.unsubscribe()
    }
}
