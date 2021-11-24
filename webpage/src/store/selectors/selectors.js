import { createSelector } from "reselect";
import { NameSpace } from "../reducers/root-reducer";

export const getDeviceStateSelect = (state) => {
  return state[NameSpace.DEV_STATE];
};
export const getDeviceSettingsSelect = (state) => {
  return state[NameSpace.DEV_SETTINGS];
};

// export const getPromo = (state) => {
//   return state[NameSpace.DATA].promo;
// };

// export const getAllFilms = (state) => {
//   return state[NameSpace.DATA].allFilms;
// };
// export const getFilmReviews = (state) => {
//   return state[NameSpace.DATA].filmReviews;
// };

// export const getActiveItemId = (state) => {
//   return state[NameSpace.STATE].activeItemId;
// };

// export const getActiveGenre = (state) => {
//   return state[NameSpace.DATA].genre;
// };