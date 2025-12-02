import { error } from '@sveltejs/kit';
import { exercisesData } from '$lib/data/exercisesData';

export const load = ({ params }) => {
  const exerciseEntry = exercisesData.find((e) => e.title === params.exerciseName);

  if (!exerciseEntry) {
    error(404, 'Exercise not found');
  }

  return {
    exerciseEntry
  };
};