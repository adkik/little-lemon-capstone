import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { submitReservation } from './api';
import { bookingSchema, getToday } from './validation';

jest.mock('./api', () => ({ submitReservation: jest.fn() }));

const submitButton = () => screen.getByRole('button', { name: /reserve a table|reserving/i });

function fillForm({ time = '18:00', date = getToday() } = {}) {
  userEvent.type(screen.getByLabelText('Name'), 'Ada');
  userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
  userEvent.type(screen.getByLabelText('Date'), date);
  userEvent.selectOptions(screen.getByLabelText('Time'), time);
}

beforeEach(() => submitReservation.mockReset());

describe('page structure', () => {
  test('uses semantic landmarks and navigation links', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About us' })).toHaveAttribute('href', '#about');
  });
});

describe('booking form', () => {
  test('shows errors and marks fields invalid on empty submit', async () => {
    render(<App />);
    userEvent.click(submitButton());
    expect(await screen.findByText('Please enter your name')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
    expect(submitReservation).not.toHaveBeenCalled();
  });

  test('rejects a past date', async () => {
    render(<App />);
    fillForm({ date: '2000-01-01' });
    userEvent.click(submitButton());
    expect(await screen.findByText('Please choose today or a future date')).toBeInTheDocument();
    expect(submitReservation).not.toHaveBeenCalled();
  });

  test('shows loading state, then confirmation', async () => {
    let finish;
    submitReservation.mockReturnValue(new Promise((resolve) => { finish = resolve; }));
    render(<App />);
    fillForm();
    userEvent.click(submitButton());

    const button = await screen.findByRole('button', { name: /reserving/i });
    expect(button).toBeDisabled();

    finish({ name: 'Ada', guests: 2, date: getToday(), time: '18:00' });
    expect(await screen.findByText(/your table for 2/i)).toBeInTheDocument();
  });

  test('shows a meaningful message when the server rejects', async () => {
    submitReservation.mockRejectedValue(new Error('Sorry, 20:00 is fully booked.'));
    render(<App />);
    fillForm({ time: '20:00' });
    userEvent.click(submitButton());
    expect(await screen.findByText('Sorry, 20:00 is fully booked.')).toBeInTheDocument();
    await waitFor(() => expect(submitButton()).toBeEnabled());
  });
});

describe('bookingSchema', () => {
  const valid = { name: 'Ada', email: 'a@b.com', date: getToday(), time: '18:00', guests: 2 };

  test('accepts valid data', async () => {
    expect(await bookingSchema.isValid(valid)).toBe(true);
  });

  test.each([
    ['bad email', { email: 'nope' }],
    ['too many guests', { guests: 11 }],
    ['zero guests', { guests: 0 }],
    ['fractional guests', { guests: 2.5 }],
    ['whitespace-only name', { name: '   ' }],
    ['unknown time', { time: '03:00' }],
    ['past date', { date: '2000-01-01' }],
  ])('rejects %s', async (_label, override) => {
    expect(await bookingSchema.isValid({ ...valid, ...override })).toBe(false);
  });
});
