import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="profile-menu"
export default class extends Controller {
  static targets = [ "menu", "menuBackground" ]
  profileMenuOpen = false
  connect() {
    this.menuTarget.hidden = true
    this.menuBackgroundTarget.hidden = true
  }

  toggleMenu() {
    this.profileMenuOpen = !this.profileMenuOpen
    this.menuTarget.hidden = !this.profileMenuOpen
    this.menuBackgroundTarget.hidden = !this.profileMenuOpen
  }
}
