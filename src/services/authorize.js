

export function authorize(data, callback) {
  console.log(data);
  localStorage.setItem('jwt', JSON.stringify(data));
  if (callback) {
    callback()
  }

}

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
}

export const removeToken = () => {
  localStorage.removeItem('jwt');
}