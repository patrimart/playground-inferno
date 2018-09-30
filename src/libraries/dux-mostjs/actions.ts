import { create } from 'most-subject';

import { Action } from './models';
import { sink } from './utils';

export const actionFactory = () => {
  const [actionSink, actionStream] = create<Action>();
  const dispatch = sink(actionSink);

  return {
    actionSink,
    actionStream,
    dispatch,
  };
};
