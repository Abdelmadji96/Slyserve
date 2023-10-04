import { API_URL } from '../../constants';

export const fetchBloodDonors = async (
  wilaya_id,
  commune_id,
  groupe_sanguin,
) => {
  const response = await fetch(
    API_URL +
      `/api/donneursang/search/${
        commune_id == 0
          ? groupe_sanguin == 0
            ? 'wilaya'
            : 'wilayatype'
          : groupe_sanguin == 0
          ? 'wilayacommune'
          : 'wilayacommunetype'
      }`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({wilaya_id, commune_id, groupe_sanguin}),
    },
  );
  const responseJson = await response.json();
  return responseJson;
};

export const bloodDonorLogin = async (phoneEmail, password) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const response = await fetch(
    API_URL +
      `/api/donneursang/login/${
        phoneEmail.match(emailRegex) ? 'email' : 'telephone'
      }`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: phoneEmail.match(emailRegex)
        ? JSON.stringify({email: phoneEmail, mdp: password})
        : JSON.stringify({telephone: phoneEmail, mdp: password}),
    },
  );
  const responseJson = await response.json();
  return responseJson;
};

export const bloodDonorCheckUnique = async (email, telephone) => {
  const response = await fetch(API_URL + '/api/donneursang/check', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({email, telephone}),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const bloodDonorRegister = async (
  prenom,
  nom,
  dateN,
  genre,
  nomRue,
  numeroTelephone,
  email,
  mdp,
  wilaya,
  commune,
  latitude,
  longitude,
  groupeSanguin,
) => {
  const response = await fetch(API_URL + '/api/donneursang/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      prenom,
      nom,
      dateN,
      genre,
      nomRue,
      numeroTelephone,
      email,
      mdp,
      wilaya,
      commune,
      latitude,
      longitude,
      groupeSanguin,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const bloodDonnorUpdateNotificationsToken = async (
  userToken,
  notificationsToken,
) => {
  const response = await fetch(
    API_URL + '/api/donneursang/updateNotificationsToken',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        notificationsToken,
      }),
    },
  );
  const responseJson = await response.json();
  return responseJson;
};
