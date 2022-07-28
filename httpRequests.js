const users = "https://jsonplaceholder.typicode.com/users";
const photos = "https://jsonplaceholder.typicode.com/photos";

export const getUsers = () => {
  return fetch(users, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((usersArray) => {
      return usersArray;
    });
};

export const getUserPhotoLink = (id) => {
  return fetch(photos + "/" + id.toString(), {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((photoObj) => {
      return photoObj.thumbnailUrl;
    });
};
