import { atom } from 'recoil';

export const signupModalState = atom({
  key: 'signupModalState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const userState = atom({
  key: 'userState',
  default : null
})