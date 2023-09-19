import {API_URL} from '@env';

export const fetchLaboratories = async (wilaya_id, commune_id) => {
  const response = await fetch(
    API_URL +
      `/api/labo/search/${commune_id == 0 ? 'wilaya' : 'wilayacommune'}`,
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

export const laboratoryCheckUnique = async (email, telephone) => {
  const response = await fetch(API_URL + '/api/labo/check', {
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

export const laboratoryLogin = async (phoneEmail, password) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const response = await fetch(
    API_URL +
      `/api/labo/login/${phoneEmail.match(emailRegex) ? 'email' : 'telephone'}`,
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

export const laboratoryRegister = async (
  nom,
  numeroTelephone,
  email,
  mdp,
  nomRue,
  wilaya,
  commune,
  latitude,
  longitude,
  agrement,
) => {
  const response = await fetch(API_URL + '/api/labo/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      nom,
      numeroTelephone,
      email,
      mdp,
      nomRue,
      wilaya,
      commune,
      latitude,
      longitude,
      agrement,
      valide: 1,
      notificationsToken: '',
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const laboratoryUpdateNotificationsToken = async (
  userToken,
  notificationsToken,
) => {
  const response = await fetch(API_URL + '/api/labo/updateNotificationsToken', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      notificationsToken,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const laboratoryUpdateAddress = async (
  userToken,
  nom_de_rue,
  wilaya_id,
  commune_id,
) => {
  const response = await fetch(API_URL + '/api/labo/update/adresse', {
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

export const laboratoryUpdateEmail = async (userToken, email) => {
  const response = await fetch(API_URL + '/api/labo/update/email', {
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

export const laboratoryUpdatePassword = async (userToken, mdp) => {
  const response = await fetch(API_URL + '/api/labo/update/password', {
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
