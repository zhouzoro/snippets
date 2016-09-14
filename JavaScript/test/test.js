Promise.resolve(1).then(() => {
  throw {message: 'asdwasd'};
}).then(res => console.log('res: ', res)).catch(err => console.error(err))
