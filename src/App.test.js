import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

test('renders login heading', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(await screen.findByRole('heading', { name: /đăng nhập/i })).toBeInTheDocument();
});
