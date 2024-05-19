import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import { successMock } from '__data_mocks__/login-mock';

const mock = new MockAdapter(axios);

describe('LoginForm', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('renders the login form', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows loading state during form submission', async () => {
    jest.useFakeTimers();

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });

    fireEvent.click(submitButton);

    mock.onPost('/api/proxy?path=api/user/login').reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, successMock]);
        }, 1000); // 1 second delay
      });
    });

    // Verify loading state
    await waitFor(() => expect(submitButton).toBeDisabled());
    expect(submitButton).toHaveTextContent(/signing in/i);

    // Advance timers and wait for the request to complete
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Verify the button is re-enabled after the request completes
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    expect(submitButton).toHaveTextContent(/sign in/i);

    jest.useRealTimers();
  });

  test('handles successful login', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });

    mock.onPost('/api/proxy?path=api/user/login').reply(200, successMock);

    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(/Welcome User/i)).toBeInTheDocument());
  });

  test.skip('handles login failure', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });

    fireEvent.click(submitButton);

    mock.onPost('/api/proxy?path=api/user/login').reply(500);

    // Verify the button is re-enabled after the request fails
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    expect(screen.queryByText(/Welcome User/i)).not.toBeInTheDocument();
    
    // Verify the login form is still displayed
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
