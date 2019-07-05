const routes = (app, redisDB) => {
  app.get('/getRoomStats', (request, response) => {
    return Promise.all(['roomCount', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
      const roomCount = values[0];
      const allRooms = JSON.parse(values[1]);
      const { fullRooms, emptyRooms } = allRooms;
      return response.status(200).json({
        roomCount, fullRooms, emptyRooms
      });
    });
  });
};

module.exports = routes;
