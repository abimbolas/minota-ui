/* eslint-disable no-shadow */

const state = {
  serverUrl: 'http://localhost:7777',
};

const getters = {
  serverUrl: state => state.serverUrl,
};

export default {
  state,
  getters,
};
