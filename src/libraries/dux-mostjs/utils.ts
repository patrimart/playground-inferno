import { AttachSink, event } from 'most-subject';
import { newDefaultScheduler, currentTime } from '@most/scheduler';

export const scheduler = newDefaultScheduler();
export const sink = <S>(s: AttachSink<S>) => (v: S) =>
  event(currentTime(scheduler), v, s);
