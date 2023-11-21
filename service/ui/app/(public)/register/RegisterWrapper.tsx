import ReduxProvider from '@/_redux/ReduxProvider';
import Register from './Register';

export function RegisterWrapper() {
  return (
    <ReduxProvider>
      <Register />
    </ReduxProvider>
  );
}
