export function scrollToContact() {
  const contactElement = document.getElementById("contact")
  if (contactElement) {
    contactElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  } else {
    // If we're not on the homepage, navigate to homepage with contact hash
    window.location.href = "/#contact"
  }
}
