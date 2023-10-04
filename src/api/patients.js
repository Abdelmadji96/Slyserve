import { API_URL } from '../../constants';

export const patientLogin = async (phoneEmail, password) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const response = await fetch(
    API_URL +
    `/api/particulier/login/${phoneEmail.match(emailRegex) ? 'email' : 'telephone'
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

export const patientCheckUnique = async (email, telephone) => {
  console.log('patientCheckUnique', email, telephone);
  const response = await fetch(API_URL + '/api/particulier/check', {
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

export const patientRegister = async (
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
) => {
  const response = await fetch(API_URL + '/api/particulier/register', {
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
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientFetchAppointments = async token => {
  const response = await fetch(API_URL + '/api/rdv/get', {
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

export const fetchRelatives = async token => {
  const response = await fetch(API_URL + '/api/particulier/proche/get', {
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

export const patientAddRelative = async (
  prenom,
  nom,
  date_de_naissance,
  genre,
  nom_de_rue,
  wilaya_id,
  commune_id,
  token,
) => {
  const response = await fetch(API_URL + '/api/particulier/proche', {
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
      wilaya_id,
      commune_id,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientEditProfile = async (
  nom_de_rue,
  wilaya_id,
  commune_id,
  email,
  mot_de_passe,
  token,
) => {
  const response = await fetch(API_URL + '/api/particulier/profile/update', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      nom_de_rue,
      wilaya_id,
      commune_id,
      email,
      mot_de_passe,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientUpdateNotificationsToken = async (
  userToken,
  notificationsToken,
) => {
  const response = await fetch(
    API_URL + '/api/particulier/updateNotificationsToken',
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

export const patientBookAppointment = async (
  date,
  heure,
  lien,
  medecin,
  patient,
  type,
  token,
) => {
  const response = await fetch(API_URL + '/api/rdv/add', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      date,
      heure,
      lien,
      medecin,
      patient,
      type,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientFetchPrescriptions = async token => {
  const response = await fetch(API_URL + '/api/ordonnance/get/particulier', {
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

export const patientFetchRecords = async token => {
  const response = await fetch(API_URL + '/api/compterendu/get', {
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

export const patientFetchTestResults = async token => {
  const response = await fetch(API_URL + '/api/resultatsAnalyse/get', {
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

export const patientFetchReports = async token => {
  const response = await fetch(API_URL + '/api/rapports/get', {
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

export const patientFetchRadiology = async token => {
  const response = await fetch(API_URL + '/api/imagerie/get', {
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

export const patientFetchVaccinations = async token => {
  const response = await fetch(API_URL + '/api/vaccins/get', {
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

export const patientAddPrescription = async (
  description,
  patient_id,
  code_barre,
  fichier,
  token,
) => {
  const response = await fetch(API_URL + '/api/ordonnance/add', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      description,
      patient_id,
      code_barre,
      fichier,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientAddRecord = async (
  description,
  patient_id,
  code_barre,
  fichier,
  token,
) => {
  const response = await fetch(API_URL + '/api/compterendu/add', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      description,
      patient_id,
      code_barre,
      fichier,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientAddTestResult = async (
  description,
  patient_id,
  code_barre,
  fichier,
  token,
) => {
  const response = await fetch(API_URL + '/api/resultatsAnalyse/add', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      description,
      patient_id,
      code_barre,
      fichier,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientAddRadiology = async (
  description,
  patient_id,
  code_barre,
  fichier,
  token,
) => {
  const response = await fetch(API_URL + '/api/imagerie/add', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      description,
      patient_id,
      code_barre,
      fichier,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientAddReport = async (
  description,
  patient_id,
  code_barre,
  fichier,
  token,
) => {
  const response = await fetch(API_URL + '/api/rapports/add', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      description,
      patient_id,
      code_barre,
      fichier,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientAddVaccination = async (
  description,
  patient_id,
  code_barre,
  fichier,
  token,
) => {
  const response = await fetch(API_URL + '/api/vaccins/add', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      description,
      patient_id,
      code_barre,
      fichier,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientProcessBalancePayment = async (userToken, amount) => {
  const response = await fetch(API_URL + '/api/particulier/payByBalance', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      amount,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};

export const patientUpdateRelative = async (
  id,
  prenom,
  nom,
  date_de_naissance,
  genre,
  nom_de_rue,
  wilaya_id,
  commune_id,
  token,
) => {
  const response = await fetch(
    API_URL + '/api/particulier/proche/update/' + id,
    {
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
        wilaya_id,
        commune_id,
      }),
    },
  );
  const responseJson = await response.json();
  return responseJson;
};

export const patientDeleteRelative = async (id, token) => {
  const response = await fetch(
    API_URL + '/api/particulier/proche/delete/' + id,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    },
  );
  const responseJson = await response.json();
  return responseJson;
};

export const patientCancelAppointment = async (userToken, rdvId) => {
  const response = await fetch(API_URL + '/api/particulier/rdv/cancel', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
    body: JSON.stringify({
      rdvId,
    }),
  });
  const responseJson = await response.json();
  return responseJson;
};
