import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

const isTest = process.env.NODE_ENV === 'test';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: isTest ? 'DRY_RUN' : 'LIVE' }),
    detectBot({
      mode: isTest ? 'DRY_RUN' : 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
    }),
    slidingWindow({
      mode: isTest ? 'DRY_RUN' : 'LIVE',
      interval: '2s',
      max: 5,
    }),
  ],
});

export default aj;