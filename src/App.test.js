import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the blog platform', () => {
  render(<App />);
  expect(screen.getAllByText('Verse').length).toBeGreaterThan(0);
  expect(screen.getByText('Home')).toBeInTheDocument();
});
