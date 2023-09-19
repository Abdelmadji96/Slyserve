import {API_URL} from '@env';

export const fetchAmbulances = async (wilaya_id, commune_id) => {
  const response = await fetch(
    API_URL +
      `/api/ambulance/search/${commune_id == 0 ? 'wilaya' : 'wilayacommune'}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({wilaya_id, commune_id}),
    },
  );
  const responseJson = await response.json();
  return responseJson;
};

export const ambulanceLogin = async (phoneEmail, password) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const response = await fetch(
    API_URL +
      `/api/ambulance/login/${
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

export const ambulanceCheckUnique = async (email, telephone) => {
  const response = await fetch(API_URL + '/api/ambulance/check', {
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

export const ambulanceRegister = async (
  nomRue,
  numeroTelephone,
  email,
  mdp,
  wilaya,
  commune,
  latitude,
  longitude,
) => {
  const response = await fetch(API_URL + '/api/ambulance/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      nomRue,
      numeroTelephone,
      email,
      mdp,
      wilaya,
      commune,
      latitude,
      longitude,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const ambulanceUpdateNotificationsToken = async (
  userToken,
  notificationsToken,
) => {
  const response = await fetch(
    API_URL + '/api/ambulance/updateNotificationsToken',
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

export const ambulanceUpdateAddress = async (
  userToken,
  nom_de_rue,
  wilaya_id,
  commune_id,
) => {
  const response = await fetch(API_URL + '/api/ambulance/update/adresse', {
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

export const ambulanceUpdateEmail = async (userToken, email) => {
  const response = await fetch(API_URL + '/api/ambulance/update/email', {
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

export const ambulanceUpdatePassword = async (userToken, mdp) => {
  const response = await fetch(API_URL + '/api/ambulance/update/password', {
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