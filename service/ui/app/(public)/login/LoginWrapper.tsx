import ReduxProvider from '@/_redux/ReduxProvider';
import Login from './Login';

export function LoginWrapper() {
  return (
    <ReduxProvider>
      <Login />
    </ReduxProvider>
  );
}
