import { Redirect } from 'react-router-dom';

import type { RootState } from 'mastodon/store';
import { useAppSelector } from 'mastodon/store';

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
// state.settings is not yet typed, so we disable some ESLint checks for this selector
const selectArea = (state: RootState) =>
  state.settings.getIn(['area']).getIn(['area', 'body']) as string | undefined;
/* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

export const AreaTimelineRedirect: React.FC = () => {
  const area = useAppSelector(selectArea);

  return <Redirect to={`/areas/${area}`} />;
};
