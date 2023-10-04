import { API_URL } from '../../constants';

export const fetchPharmacies = async (wilaya_id, commune_id) => {
  const response = await fetch(
    API_URL +
    `/api/pharmacie/search/${commune_id == 0 ? 'wilaya' : 'wilayacommune'}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ wilaya_id, commune_id }),
    },
  );
  const responseJson = await response.json();
  return responseJson;
};

export const pharmacyLogin = async (phoneEmail, password) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const response = await fetch(
    API_URL +
    `/api/pharmacie/login/${phoneEmail.match(emailRegex) ? 'email' : 'telephone'
    }`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: phoneEmail.match(emailRegex)
        ? JSON.stringify({ email: phoneEmail, mdp: password })
        : JSON.stringify({ telephone: phoneEmail, mdp: password }),
    },
  );
  const responseJson = await response.json();
  return responseJson;
};

export const pharmacyCheckUnique = async (email, telephone) => {
  const response = await fetch(API_URL + '/api/pharmacie/check', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ email, telephone }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const pharmacyRegister = async (
  nomRue,
  numeroTelephone,
  email,
  mdp,
  wilaya,
  commune,
  latitude,
  longitude,
  agrement,
) => {
  const response = await fetch(API_URL + '/api/pharmacie/register', {
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
      agrement,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const pharmacyUpdateNotificationsToken = async (
  userToken,
  notificationsToken,
) => {
  const response = await fetch(
    API_URL + '/api/pharmacie/updateNotificationsToken',
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

export const pharmacyUpdateAddress = async (
  userToken,
  nom_de_rue,
  wilaya_id,
  commune_id,
) => {
  const response = await fetch(API_URL + '/api/pharmacie/update/adresse', {
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

export const pharmacyUpdateEmail = async (userToken, email) => {
  const response = await fetch(API_URL + '/api/pharmacie/update/email', {
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

export const pharmacyUpdatePassword = async (userToken, mdp) => {
  const response = await fetch(API_URL + '/api/pharmacie/update/password', {
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