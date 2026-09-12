import { Redirect } from 'react-router-dom';

import type { RootState } from 'mastodon/store';
import { useAppSelector } from 'mastodon/store';

const selectArea = (state: RootState) =>
  state.settings.getIn(['area', 'area', 'body']) as string | undefined;

export const AreaTimelineRedirect: React.FC = () => {
  const area = useAppSelector(selectArea);

  return <Redirect to={`/areas/${area}`} />;
};

// eslint-disable-next-line import/no-default-export
export default AreaTimelineRedirect; // required for async bundle loading via bundle.jsx
