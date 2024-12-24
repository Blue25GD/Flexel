import {Controller} from "@hotwired/stimulus"
import consumer from "channels/consumer"
import {block_bubbling_for_elements} from "application";

// Connects to data-controller="service-sidepanel"
export default class extends Controller {
    static targets = ["serviceName", "serviceNameInput"]

    channel = null
    observer = null

    input = document.getElementById('service-id');

    serviceId = null;

    connect() {
        const elementToBlockBubbling = document.getElementsByClassName('panel')[0];

        block_bubbling_for_elements([elementToBlockBubbling]);

        this.observer = new MutationObserver(this.observeValueChange.bind(this));
        this.observer.observe(this.input, {attributes: true, attributeFilter: ["value"]})

        this.channel = consumer.subscriptions.create("ServiceSidepanelChannel", {
            connected() {
            },

            disconnected() {
            },

            received: (data) => {
                data = data.data;
                const values = data.values;
                switch (data.type) {
                    case "service":
                        // render the service
                        const service = values[0];
                        this.serviceNameTarget.innerHTML = service.name;
                        break;
                }
            }
        });

        window.addEventListener("modal:service-name:submit", this.updateServiceName.bind(this));
        window.addEventListener("modal:connect-image:submit", this.connectImageSubmission.bind(this));
    }

    serviceIdChange() {
        this.channel.perform('request_service', {service_id: this.serviceId});
    }

    closePanel() {
        document.getElementById('service-sidepanel').style.display = 'none';
    }

    deleteService() {
        this.channel.perform('delete_service', {service_id: this.serviceId});
        this.closePanel()
    }

    disconnect() {
        this.channel.unsubscribe();

        if (this.observer) {
            this.observer.disconnect();
        }

        window.removeEventListener("modal:service-name:submit", this.updateServiceName.bind(this));
        window.removeEventListener("modal:connect-image:submit", this.connectImageSubmission.bind(this));
    }

    openUpdateServiceNameOverlay() {
        const event = new CustomEvent("modal:service-name:open", {
            bubbles: true,
        });
        window.dispatchEvent(event);
    }

    updateServiceName(event) {
        console.log(event);
        const newName = event.detail.value;
        console.log(newName);
        this.channel.perform('update_service_name', {service_id: this.serviceId, name: newName});
        console.log('update');
    }

    observeValueChange(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === "attributes" && mutation.attributeName === "value") {
                this.serviceId = parseInt(mutation.target.value);
                this.serviceIdChange();
            }
        }
    }

    openConnectImageModal() {
        const event = new CustomEvent("modal:connect-image:open", {
            bubbles: true,
        });
        window.dispatchEvent(event);
    }

    connectImageSubmission(event) {
        const imageName = event.detail.value;
        this.channel.perform('connect_image', {service_id: this.serviceId, image_name: imageName});
    }
}
