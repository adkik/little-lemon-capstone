// Fake "server" call so the form feels real. It waits, then succeeds or fails.
export const FULLY_BOOKED_TIME = '20:00';

export function submitReservation(values) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (values.time === FULLY_BOOKED_TIME) {
        reject(new Error(`Sorry, ${FULLY_BOOKED_TIME} is fully booked. Please choose another time.`));
      } else {
        resolve({ id: Date.now(), ...values });
      }
    }, 1500);
  });
}
