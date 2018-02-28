import axios from 'axios';

const baseUrl = 'https://xqjyoq9c3j.execute-api.us-east-1.amazonaws.com/dev';

export function uploadFile(file) {
  return axios.post(`${baseUrl}/uploadFile`, file)
    .then(response => response.data)
    .catch(handleError);
}

function handleError(err) {
  console.error(err); // eslint-disable-line no-console
}