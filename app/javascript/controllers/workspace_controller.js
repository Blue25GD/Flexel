import {Controller} from "@hotwired/stimulus";
import consumer from "channels/consumer"

export default class extends Controller {
    static targets = [
        "macShortcut", "normalShortcut", "spotlightSearch", "addService", "viewport", "workspace"
    ];

    channel = null;

    connect() {
        this.isMac = navigator.platform.toUpperCase().includes('MAC');
        this.scale = 1;
        this.minScale = 0.5;
        this.maxScale = 3;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.lastTouchDistance = 0;
        this.lastViewportWidth = this.viewportTarget.clientWidth;
        this.lastViewportHeight = this.viewportTarget.clientHeight;

        this.updateInitialPosition();
        this.toggleShortcuts();
        this.addEventListeners();

        const url = window.location.pathname;
        const projectId = url.split("/")[2];

        this.channel = consumer.subscriptions.create({channel: "ServicesChannel", project_id: projectId}, {
            connected: () => {
                // Called when the subscription is ready for use on the server
                this.channel.perform('request_services');
            },

            disconnected() {
                // Called when the subscription has been terminated by the server
            },

            received: (data) => {
                // Called when there's incoming data on the websocket for this channel
                data = data.data
                const values = data.values
              switch (data.type) {
                case "services":
                  if (values.length === 0) {
                    return
                  }
                  // get rid of the "add service" button
                  document.getElementsByClassName("add-service")[0].style.display = "none"
                  document.getElementsByClassName("add-service")[0].id = ""

                  const template = document.getElementById("service-template");

                  let totalServices = values.length;
                  let centerService = Math.floor(totalServices / 2);

                  for (let i = 0; i < totalServices; i++) {
                    const service = values[i];
                    const clone = template.cloneNode(true);
                    clone.querySelector(".service-name").textContent = service.name;

                    clone.style.display = "flex";
                    clone.id = "";

                    // Add spacing between the services
                    clone.style.margin = "10px";  // Adjust margin as needed

                    if (i === centerService) {
                      clone.id = "center-point";
                    }

                    const workspace = document.getElementById("workspace");
                    workspace.appendChild(clone);
                  }

                  this.updateInitialPosition()
              }

            }
        });

    }

  updateInitialPosition() {
    const centerPoint = document.getElementById("center-point");
    const viewportWidth = this.viewportTarget.clientWidth;
    const viewportHeight = this.viewportTarget.clientHeight;

    // Get the center point's position in the viewport
    const rect = centerPoint.getBoundingClientRect();
    const elementWidth = rect.width;
    const elementHeight = rect.height;

    // Get the current center point's x and y coordinates (its center relative to the viewport)
    const centerX = centerPoint.offsetLeft + elementWidth / 2;
    const centerY = centerPoint.offsetTop + elementHeight / 2;

    // Calculate the translation needed to center the element
    this.translateX = (viewportWidth / 2) - centerX;
    this.translateY = (viewportHeight / 2) - centerY;

    // Apply the calculated translation to the element
    this.updateTransform();
  }

  toggleShortcuts() {
        const displayMac = this.isMac ? "block" : "none";
        const displayNormal = this.isMac ? "none" : "block";

        this.macShortcutTargets.forEach(shortcut => shortcut.style.display = displayMac);
        this.normalShortcutTargets.forEach(shortcut => shortcut.style.display = displayNormal);
    }

    handleSpotlight() {
        const spotlight = document.getElementById("spotlight");
        spotlight.style.display = "flex";
        spotlight.focus();
    }

    addEventListeners() {
        document.onkeydown = this.handleKeyDown.bind(this);
        this.addServiceTarget.addEventListener("click", this.handleSpotlight.bind(this));
        this.viewportTarget.addEventListener("wheel", this.handleWheel.bind(this), {passive: false});
        this.viewportTarget.addEventListener("touchstart", this.handleTouchStart.bind(this));
        this.viewportTarget.addEventListener("touchmove", this.handleTouchMove.bind(this), {passive: false});
        this.viewportTarget.addEventListener("touchend", this.stopDragging.bind(this));
        this.viewportTarget.addEventListener("mousedown", this.handleMouseDown.bind(this));
        this.viewportTarget.addEventListener("mousemove", this.handleMouseMove.bind(this));
        this.viewportTarget.addEventListener("mouseup", this.stopDragging.bind(this));
        this.viewportTarget.addEventListener("mouseleave", this.stopDragging.bind(this));

        window.addEventListener("mouseup", this.stopDragging.bind(this));
        window.addEventListener("blur", this.stopDragging.bind(this));
        window.addEventListener("resize", this.handleResize.bind(this));
    }

    handleKeyDown(e) {
        if ((this.isMac && e.metaKey && e.key === "k") || (!this.isMac && e.ctrlKey && e.key === "k")) {
            e.preventDefault();
            this.handleSpotlight();
        }
    }

    handleWheel(e) {
        e.preventDefault();
        if (e.ctrlKey) {
            this.zoom(e.deltaY, e.clientX, e.clientY - 60);
        } else {
            this.pan(-e.deltaX, -e.deltaY);
        }
    }

    handleTouchStart(e) {
        if (e.touches.length === 2) {
            this.lastTouchDistance = this.getTouchDistance(e.touches);
        } else if (e.touches.length === 1) {
            this.isDragging = true;
            this.startX = e.touches[0].clientX - this.translateX;
            this.startY = e.touches[0].clientY - this.translateY;
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 2) {
            const currentDistance = this.getTouchDistance(e.touches);
            const delta = currentDistance - this.lastTouchDistance;
            const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            this.zoom(delta, centerX, centerY);
            this.lastTouchDistance = currentDistance;
        } else if (e.touches.length === 1 && this.isDragging) {
            this.translateX = e.touches[0].clientX - this.startX;
            this.translateY = e.touches[0].clientY - this.startY;
            this.updateTransform();
        }
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX - this.translateX;
        this.startY = e.clientY - this.translateY;
        this.viewportTarget.style.cursor = "grabbing";
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.translateX = e.clientX - this.startX;
        this.translateY = e.clientY - this.startY;
        this.updateTransform();
    }

    stopDragging() {
        if (this.isDragging) {
            this.isDragging = false;
            this.viewportTarget.style.cursor = "grab";
        }
    }

    handleResize() {
        const deltaWidth = this.viewportTarget.clientWidth - this.lastViewportWidth;
        const deltaHeight = this.viewportTarget.clientHeight - this.lastViewportHeight;

        this.translateX += deltaWidth / 2;
        this.translateY += deltaHeight / 2;

        this.lastViewportWidth = this.viewportTarget.clientWidth;
        this.lastViewportHeight = this.viewportTarget.clientHeight;

        this.updateTransform();
    }

    getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    zoom(delta, originX, originY) {
        const step = 1.05;
        const oldScale = this.scale;
        this.scale = this.clamp(delta > 0 ? this.scale / step : this.scale * step, this.minScale, this.maxScale);

        const deltaX = (originX - this.translateX) * (1 - this.scale / oldScale);
        const deltaY = (originY - this.translateY) * (1 - this.scale / oldScale);

        this.translateX += deltaX;
        this.translateY += deltaY;
        this.updateTransform();
    }

    pan(dx, dy) {
        this.translateX += dx;
        this.translateY += dy;
        this.updateTransform();
    }

    updateTransform() {
        this.workspaceTarget.style.transformOrigin = "0 0";
        this.workspaceTarget.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        this.viewportTarget.style.backgroundSize = `${30 * this.scale}px ${30 * this.scale}px`;
        this.viewportTarget.style.backgroundPosition = `${this.translateX}px ${this.translateY}px`;
    }
}
