import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="input-modal"
export default class extends Controller {
    static targets = ["input"]

    // overlay = this.element;
    modalId = this.element.querySelector(".modal-id").value;

    connect() {
        window.addEventListener(`modal:${this.modalId}:open`, this.openModal.bind(this));
        window.addEventListener(`modal:${this.modalId}:close`, this.closeModal.bind(this));
    }

    disconnect() {
        window.removeEventListener(`modal:${this.modalId}:open`, this.openModal.bind(this));
        window.removeEventListener(`modal:${this.modalId}:close`, this.openModal.bind(this));
    }

    openModal(event) {
        this.element.style.display = 'flex';
        this.inputTarget.focus();
    }

    closeModal(event, force = false) {
        event.stopPropagation();
        if (event instanceof KeyboardEvent && event.key !== "Escape" && !force) {
            return;
        }
        this.element.style.display = 'none';
        this.inputTarget.value = '';
    }

    submitForm(event) {
        if (event instanceof KeyboardEvent && event.key !== "Enter") {
            return;
        }

        const value = this.inputTarget.value;
        this.closeModal(event, true);
        const message = new CustomEvent(`modal:${this.modalId}:submit`, {
            bubbles: true,
            detail: {value}
        });
        window.dispatchEvent(message);
    }
}
