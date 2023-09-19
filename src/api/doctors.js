import {API_URL} from '@env';

export const fetchDoctors = async (wilaya, commune, specialite) => {
  const response = await fetch(API_URL + '/professionnels/search/medecins', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({wilaya, commune, specialite}),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorLogin = async (phoneEmail, password) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const response = await fetch(
    API_URL +
      `/api/medecin/login/${
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

export const doctorRegister = async (
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
  const response = await fetch(API_URL + '/api/medecin/register', {
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

export const doctorCheckUnique = async (email, telephone) => {
  const response = await fetch(API_URL + '/api/medecin/check', {
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

export const fetchDoctorInfos = async id => {
  const response = await fetch(API_URL + '/professionnels/medecin/info/' + id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

export const fetchDoctorAppointments = async token => {
  const response = await fetch(API_URL + '/api/rdv/get/bymedecin', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

export const fetchDoctorWorkingHours = async (id, date) => {
  const response = await fetch(API_URL + '/api/medecin/horaires', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      medecin: id,
      day: date,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const fetchDoctorPatients = async token => {
  const response = await fetch(API_URL + '/api/medecin/patients/get', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorAddPatient = async (
  prenom,
  nom,
  date_de_naissance,
  genre,
  nom_de_rue,
  telephone,
  wilaya_id,
  commune_id,
  token,
) => {
  const response = await fetch(API_URL + '/api/medecin/patients/add', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      prenom,
      nom,
      date_de_naissance,
      genre,
      nom_de_rue,
      telephone,
      wilaya_id,
      commune_id,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorUpdatePatient = async (
  id,
  prenom,
  nom,
  date_de_naissance,
  genre,
  nom_de_rue,
  telephone,
  wilaya_id,
  commune_id,
  token,
) => {
  const response = await fetch(API_URL + '/api/medecin/patients/update/' + id, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      prenom,
      nom,
      date_de_naissance,
      genre,
      nom_de_rue,
      telephone,
      wilaya_id,
      commune_id,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorDeletePatient = async (id, token) => {
  const response = await fetch(API_URL + '/api/medecin/patients/delete/' + id, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

export const fetchDoctorProfile = async id => {
  const response = await fetch(API_URL + '/professionnels/medecin/info/' + id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

export const fetchDoctorSubscription = async token => {
  const response = await fetch(API_URL + '/api/abonnement/medecin/get', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorUpdateNotificationsToken = async (
  userToken,
  notificationsToken,
) => {
  const response = await fetch(
    API_URL + '/api/medecin/updateNotificationsToken',
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

export const doctorUpdateAddress = async (
  userToken,
  nom_de_rue,
  wilaya_id,
  commune_id,
) => {
  const response = await fetch(API_URL + '/api/medecin/update/adresse', {
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

export const doctorUpdateEmail = async (userToken, email) => {
  const response = await fetch(API_URL + '/api/medecin/update/email', {
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

export const doctorUpdatePassword = async (userToken, password) => {
  const response = await fetch(API_URL + '/api/medecin/update/password', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      password,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorUpdatePresentation = async (userToken, presentation) => {
  const response = await fetch(API_URL + '/api/medecin/update/presentation', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      presentation,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorUpdateSpokenLanguages = async (userToken, langues) => {
  const response = await fetch(API_URL + '/api/medecin/update/langues', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      langues,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorUpdateFormations = async (userToken, formations) => {
  const response = await fetch(API_URL + '/api/medecin/update/formations', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      formations,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorUpdateSessionTime = async (userToken, duree_seance) => {
  const response = await fetch(API_URL + '/api/medecin/update/duree', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      duree_seance,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorUpdatePricing = async (
  userToken,
  tarif_cabinet,
  tarif_video,
) => {
  const response = await fetch(API_URL + '/api/medecin/update/tarifs', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      tarif_cabinet,
      tarif_video,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorUpdateWorkingHours = async (
  userToken,
  workingDays,
  sessionDuration,
) => {
  const response = await fetch(API_URL + '/api/medecin/update/horaires', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: sessionDuration
      ? JSON.stringify({
          horaires: workingDays,
          dureeSeance: sessionDuration,
        })
      : JSON.stringify({horaires: workingDays}),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorUpdateRemainingMinutes = async userToken => {
  const response = await fetch(API_URL + '/api/medecin/update/minutes', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorGetSubscription1 = async userToken => {
  const response = await fetch(API_URL + '/api/medecin/abonnement/get1', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

export const doctorGetSubscription2 = async userToken => {
  const response = await fetch(API_URL + '/api/medecin/abonnement/get2', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
  });
  const responseJson = await response.json();
  return responseJson;
};
