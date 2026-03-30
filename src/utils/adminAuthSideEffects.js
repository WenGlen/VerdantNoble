import axios from "axios";

/** Cookie + axios header（獨立模組，避免 react-hooks/immutability 在元件內報錯） */
export function persistGlenToken(token, expired) {
  document.cookie = `GlenToken=${token};expires=${new Date(expired)};`;
}

export function setAxiosAuthorization(token) {
  axios.defaults.headers.common.Authorization = token;
}
