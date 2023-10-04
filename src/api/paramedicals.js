import { API_URL } from '../../constants';

export const fetchParamedicals = async (wilaya, commune, specialite) => {
  const response = await fetch(
    API_URL + '/professionnels/search/paramedicals',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({wilaya, commune, specialite}),
    },
  );
  const responseJson = await response.json();
  return responseJson;
};

export const paramedicalLogin = async (phoneEmail, password) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const response = await fetch(
    API_URL +
      `/api/paramedical/login/${
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

export const paramedicalCheckUnique = async (email, telephone) => {
  const response = await fetch(API_URL + '/api/paramedical/check', {
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

export const paramedicalRegister = async (
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
  specialite,
  latitude,
  longitude,
) => {
  const response = await fetch(API_URL + '/api/paramedical/register', {
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
      specialite,
      latitude,
      longitude,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const paramedicalUpdateNotificationsToken = async (
  userToken,
  notificationsToken,
) => {
  const response = await fetch(
    API_URL + '/api/paramedical/updateNotificationsToken',
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

export const paramedicalUpdateAddress = async (
  userToken,
  nom_de_rue,
  wilaya_id,
  commune_id,
) => {
  const response = await fetch(API_URL + '/api/paramedical/update/adresse', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      nom_de_rue,
      wilaya_id,
      commune_id,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const paramedicalUpdateEmail = async (userToken, email) => {
  const response = await fetch(API_URL + '/api/paramedical/update/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      email,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const paramedicalUpdatePassword = async (userToken, mdp) => {
  const response = await fetch(API_URL + '/api/paramedical/update/password', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      mdp,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};