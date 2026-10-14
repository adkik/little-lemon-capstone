import * as Yup from 'yup';

export const timeSlots = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

// Today as YYYY-MM-DD in local time (what <input type="date"> uses)
export const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

export const bookingSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be 50 characters or fewer')
    .required('Please enter your name'),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email, e.g. name@example.com')
    .required('Please enter your email'),
  date: Yup.string()
    .required('Please choose a date')
    .test('not-past', 'Please choose today or a future date', (value) => !value || value >= getToday()),
  time: Yup.string()
    .oneOf(timeSlots, 'Please choose one of the available times')
    .required('Please choose a time'),
  guests: Yup.number()
    .typeError('Please enter the number of guests')
    .integer('Guests must be a whole number')
    .min(1, 'At least 1 guest is required')
    .max(10, 'For parties over 10, please call us')
    .required('Please enter the number of guests'),
});
