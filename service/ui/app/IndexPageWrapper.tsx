import ReduxProvider from '@/_redux/ReduxProvider';
import { IndexPage } from '@/IndexPage';

export function IndexPageWrapper() {
  return (
    <ReduxProvider>
      <IndexPage />
    </ReduxProvider>
  );
}
