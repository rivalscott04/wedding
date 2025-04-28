
import { validateGuest } from "@/utils/guestList";

// This simulates a Next.js API route
export async function checkGuest(name: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const isInvited = validateGuest(name);
  
  return {
    isInvited,
    message: isInvited ? "Guest is invited" : "Guest is not on the invitation list"
  };
}
