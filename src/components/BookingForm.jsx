import { useState } from 'react';
import { useFormik } from 'formik';
import { bookingSchema, timeSlots, getToday } from '../validation';
import { submitReservation } from '../api';

function BookingForm() {
  const [confirmed, setConfirmed] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const formik = useFormik({
    initialValues: { name: '', email: '', date: '', time: '', guests: 2 },
    validationSchema: bookingSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitError('');
      try {
        const result = await submitReservation(values);
        setConfirmed(result);
        resetForm();
      } catch (err) {
        setSubmitError(err.message || 'Something went wrong. Please try again.');
      }
    },
  });

  const { isSubmitting } = formik;

  // Props shared by every field: value/onChange/onBlur plus accessibility attributes
  const fieldProps = (field) => {
    const hasError = formik.touched[field] && formik.errors[field];
    return {
      id: field,
      ...formik.getFieldProps(field),
      disabled: isSubmitting,
      'aria-invalid': hasError ? 'true' : 'false',
      'aria-describedby': hasError ? `${field}-error` : undefined,
    };
  };

  const error = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <span id={`${field}-error`} className="error" role="alert">
        {formik.errors[field]}
      </span>
    ) : null;

  if (confirmed) {
    return (
      <div className="confirmation" role="status">
        <h3>Thank you, {confirmed.name}!</h3>
        <p>
          Your table for {confirmed.guests} on {confirmed.date} at {confirmed.time} is reserved.
        </p>
        <button type="button" onClick={() => setConfirmed(null)}>
          Make another reservation
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} noValidate aria-busy={isSubmitting}>
      {submitError && (
        <div className="form-error" role="alert">
          {submitError}
        </div>
      )}

      <label htmlFor="name">Name</label>
      <input type="text" autoComplete="name" {...fieldProps('name')} />
      {error('name')}

      <label htmlFor="email">Email</label>
      <input type="email" autoComplete="email" {...fieldProps('email')} />
      {error('email')}

      <label htmlFor="date">Date</label>
      <input type="date" min={getToday()} {...fieldProps('date')} />
      {error('date')}

      <label htmlFor="time">Time</label>
      <select {...fieldProps('time')}>
        <option value="">Select a time</option>
        {timeSlots.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      {error('time')}

      <label htmlFor="guests">Guests</label>
      <input type="number" min="1" max="10" {...fieldProps('guests')} />
      {error('guests')}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Reserving...
          </>
        ) : (
          'Reserve a table'
        )}
      </button>
    </form>
  );
}

export default BookingForm;
