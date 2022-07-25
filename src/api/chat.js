import request from '@/utils/request';

// <<<<<<< HEAD
// export const history = (data) => {
//   return request("post", "/chat/history", data);
// };

// =======
export const history = data => request('post', '/chat/history', data);

export const createRoom = data => request('post', '/chat/createRoom', data);

export const queryRoomInfo = data => request('get', '/chat/roomInfo', data);

export const updateRoomInfo = data => request('post', '/chat/updateRoomInfo', data);
// >>>>>>> e269c40c8398d0f438758f2ce454a0cc8b761fa0
