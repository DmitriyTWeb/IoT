// файл в разработке, пока не работает

const getStatus = () => (dispatch, __getState, api) =>
  api.get('get_total_status')
    .then((response) => console.log('api-action get_total_status response = ', response));

export {getStatus};