// Switch this one value to flip the entire system between
// a campus (institutional) deployment and a commercial
// establishment (mall / office / venue) deployment.
export const VENUE_TYPE = "campus"; // "campus" | "establishment"

const CONFIGS = {
  campus: {
    venueLabel: "Campus",
    appName: "Campus Parking",
    locationLabel: "Lot",
    spaceLabel: "Stall",
    idFieldLabel: "Student / Employee ID",
    idFieldPlaceholder: "2023-00123",
    roles: [
      { value: "student", label: "Student" },
      { value: "faculty", label: "Faculty" },
      { value: "admin", label: "Admin" },
    ],
    zones: [
      { value: "Student", label: "Student" },
      { value: "Faculty", label: "Faculty" },
      { value: "Visitor", label: "Visitor" },
    ],
    showPricing: false,
    tagline: "Reserve Your Campus Parking Spot in Seconds",
    subtext: "Stop circling the lot. Book a stall ahead of time and drive straight to it.",
  },
  establishment: {
    venueLabel: "Venue",
    appName: "Parking Reservations",
    locationLabel: "Zone",
    spaceLabel: "Space",
    idFieldLabel: "Phone Number",
    idFieldPlaceholder: "0917 123 4567",
    roles: [
      { value: "guest", label: "Guest" },
      { value: "member", label: "Member" },
      { value: "admin", label: "Admin" },
    ],
    zones: [
      { value: "Standard", label: "Standard" },
      { value: "VIP", label: "VIP" },
      { value: "Accessible", label: "Accessible" },
    ],
    showPricing: true,
    ratePerSlot: 60, // currency units per time slot, only used when showPricing is true
    tagline: "Reserve Your Parking Spot in Seconds",
    subtext: "Stop circling the lot. Book a space ahead of time and drive straight to it.",
  },
};

export const venueConfig = CONFIGS[VENUE_TYPE];
