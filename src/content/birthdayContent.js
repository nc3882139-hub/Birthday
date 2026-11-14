import beachImg from '../assets/images/beach-memory.webp';
import cafeImg from '../assets/images/cafe-memory.webp';

export const birthdayContent = {
  recipient: 'Your Name',
  nickname: 'Rainbow',
  sender: 'Priyanshu',
  chapters: [
    { label: 'The Beginning', shortLabel: 'Beginning', targetId: 'beginning' },
    { label: 'Beautiful Memories', shortLabel: 'Memories', targetId: 'memories' },
    { label: 'Little Things That Matter', shortLabel: 'Little Things', targetId: 'little-things' },
    { label: 'Birthday Wishes', shortLabel: 'Wishes', targetId: 'wishes' },
    { label: 'A Letter From the Heart', shortLabel: 'The Letter', targetId: 'letter' },
    { label: 'The Grand Finale', shortLabel: 'Finale', targetId: 'finale' }
  ],
  memories: [
    {
      image: beachImg,
      alt: 'Illustrative sunset scene; replace with a personal photograph.',
      title: 'A favorite moment',
      label: 'Sample · swap for a photo',
      description: 'Replace this sample scene and note with a memory you both love.'
    },
    {
      image: cafeImg,
      alt: 'Illustrative cafe scene; replace with a personal photograph.',
      title: 'A little tradition',
      label: 'Sample · swap for a photo',
      description: 'Add a place, ritual, or shared moment that feels like the two of you.'
    }
  ],
  littleThings: [
    'Add a small detail about Your Name that always makes you smile.',
    'Write down a little ritual, joke, or kindness you never want to forget.',
    'Remind her of something wonderful about herself.'
  ],
  wishes: [
    'May this year bring you more joy than you can imagine.',
    'Wishing you a year filled with laughter and beautiful surprises.',
    'May every new beginning bring you closer to what makes you happy.',
    'May you always feel celebrated, today and every day.'
  ],
  letter: `Dear Your Name,\n\n[Add a personal memory or a few words you want her to remember.]\n\nI hope the year ahead brings you laughter, calm, courage, and every good thing you deserve.\n\nHappy birthday, Rainbow.\n\nWith love,\nPriyanshu`
};
