import {Controller} from "@hotwired/stimulus"
import {block_bubbling_for_elements} from "application";
import consumer from "channels/consumer"

// Connects to data-controller="activity-log"
export default class extends Controller {
    static targets = ["content", "toasts", "neutralToastTemplate", "successToastTemplate", "errorToastTemplate"]

    isOpen = false

    channel = null

    connect() {
        const elementsToBlockBubbling = document.querySelectorAll('#activity-log *');

        block_bubbling_for_elements(elementsToBlockBubbling);

        this.channel = consumer.subscriptions.create("ActivityLogChannel", {
            connected() {
                // Called when the subscription is ready for use on the server
            },

            disconnected() {
                // Called when the subscription has been terminated by the server
            },

            received: (data) => {
                // Called when there's incoming data on the websocket for this channel
                data = data.data;
                const values = data.values;
                switch (data.type) {
                    case "toast":
                        this.addToast(values["message"], values["type"]);
                        break;
                }
            }
        });
    }

    toggleActivityLog(event) {
        event.preventDefault()
        this.isOpen = !this.isOpen
        const activityLog = document.getElementById('activity-log')
        activityLog.style.height = this.isOpen ? 'calc(100% - 24px - 36px - 24px)' : 'auto'
        this.contentTarget.style.display = this.isOpen ? 'flex' : 'none'
    }

    addToast(message, type) {
        let clone = null;
        switch (type) {
            case 'success':
                clone = this.successToastTemplateTarget.cloneNode(true)
                break;
            case 'error':
                clone = this.errorToastTemplateTarget.cloneNode(true)
                break;
            default:
                clone = this.neutralToastTemplateTarget.cloneNode(true)
        }
        clone.style.display = 'block'
        clone.querySelector('.toast-message').innerText = message
        this.toastsTarget.appendChild(clone)

        setTimeout(() => {
            clone.remove()
        }, 5000)
    }

    addNeutralToast(message) {
        this.addToast(message, 'neutral')
    }

    addSuccessToast(message) {
        this.addToast(message, 'success')
    }

    addErrorToast(message) {
        this.addToast(message, 'error')
    }

    dismissToast(event) {
        event.preventDefault()
        event.target.closest('.toast').remove()
    }

    testNeutralToast(event) {
        event.preventDefault()
        this.addNeutralToast('This is a neutral toast message')
    }

    testSuccessToast(event) {
        event.preventDefault()
        this.addSuccessToast('This is a success toast message')
    }

    testErrorToast(event) {
        event.preventDefault()
        this.addErrorToast('This is an error toast message')
    }
}
