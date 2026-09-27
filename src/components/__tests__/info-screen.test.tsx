import { render } from '@testing-library/react-native';

import { InfoScreen } from '../info-screen';

test('shows a kid screen title and message', async () => {
  const view = await render(
    <InfoScreen title="Home" message="Hello! Ready to visit the harbor?" />,
  );

  expect(view.getByRole('header', { name: 'Home' })).toBeTruthy();
  expect(view.getByText('Hello! Ready to visit the harbor?')).toBeTruthy();
});
