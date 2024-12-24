import {Controller} from "@hotwired/stimulus"
import consumer from "channels/consumer"
import {block_bubbling_for_elements} from "application";

// Connects to data-controller="service-sidepanel"
export default class extends Controller {
    static targets = ["serviceName", "serviceNameInput"]

    channel = null
    observer = null

    input = document.getElementById('service-id');
    updateServiceNameOverlay = document.getElementById('update-service-name-overlay');

    serviceId = null;

    connect() {
        const elementToBlockBubbling = document.getElementsByClassName('panel')[0];

        block_bubbling_for_elements([elementToBlockBubbling]);

        this.observer = new MutationObserver(this.observeValueChange.bind(this));
        this.observer.observe(this.input, {attributes: true, attributeFilter: ["value"]});

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
    }

    openUpdateServiceNameOverlay() {
        this.updateServiceNameOverlay.style.display = 'flex';
        this.serviceNameInputTarget.value = this.serviceNameTarget.innerHTML;
    }

    closeUpdateServiceNameOverlay(event, force = false) {
        event.stopPropagation();
        // event.preventDefault();
        if (event instanceof KeyboardEvent && event.key !== "Escape" && !force) {
            return;
        }

        this.updateServiceNameOverlay.style.display = 'none';
    }

    updateServiceName(event) {
        if (event instanceof KeyboardEvent && event.key !== "Enter") {
            return;
        }
        const newName = event.target.value;
        this.channel.perform('update_service_name', {service_id: this.serviceId, name: newName});
        this.closeUpdateServiceNameOverlay(event, true);
    }

    observeValueChange(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === "attributes" && mutation.attributeName === "value") {
                this.serviceId = parseInt(mutation.target.value);
                this.serviceIdChange();
            }
        }
    }
}
