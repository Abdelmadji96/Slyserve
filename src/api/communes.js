import { API_URL } from '../../constants';

export const fetchCommunes = async wilaya_id => {
  const response = await fetch(API_URL + '/api/communes', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ wilaya_id }),
  });
  const responseJson = await response.json();
  return responseJson;
};
