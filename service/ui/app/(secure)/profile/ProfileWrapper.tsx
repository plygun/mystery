import ReduxProvider from '@/_redux/ReduxProvider';
import { Profile } from '@/(secure)/profile/Profile';

export function ProfileWrapper() {
  return (
    <ReduxProvider>
      <Profile />
    </ReduxProvider>
  );
}
