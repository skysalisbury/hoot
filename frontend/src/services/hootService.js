import sendRequest from './sendRequest';

const BASE_URL = '/api/hoots';

export async function index() {
  return sendRequest(BASE_URL);
}

export async function create(hootData) {
  return sendRequest(BASE_URL, 'POST', hootData);
}

export async function show(hootId) {
  return sendRequest(`${BASE_URL}/${hootId}`);
}

export async function update(hootId, hootFormData) {
  return sendRequest(`${BASE_URL}/${hootId}`, 'PUT', hootFormData);
}

export async function deletedHoot(hootId) {
  return sendRequest(BASE_URL, 'DELETE', hootId);
}

export async function createComment(hootId, commentFormData) {
  return sendRequest(`${BASE_URL}/${hootId}/comments`, 'POST', commentFormData);
}

export async function deleteComment(hootId, commentId) {
  return sendRequest(`${BASE_URL}/${hootId}/comments/${commentId}`, 'DELETE');
}

export async function updateComment(hootId, commentId, commentFormData) {
  return sendRequest(
    `${BASE_URL}/${hootId}/comments/${commentId}`,
    'PUT',
    commentFormData
  );
}
