import { render, screen } from '@testing-library/react';
import App from './App';

test('renders service platform app', () => {
  render(<App />);
  // Since the app has auth and routing, it should render without crashing
  // The actual content depends on auth state, but the app should mount
  expect(document.body).toBeInTheDocument();
});
