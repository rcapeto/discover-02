let data = [
   {
      id: 1,
      name: 'Pizzaria Guloso',
      'daily-hours': 2,
      'total-hours': 60,
      created_at: Date.now(),
   },
   {
      id: 2,
      name: 'OneTwo Project',
      'daily-hours': 3,
      'total-hours': 47,
      created_at: Date.now(),
   }
];

module.exports = {
   get() {
      return data;
   },
   upgrade(newData) {
      data = newData;
   },
   delete(id) {
      data = data.filter(job => String(job.id) !== id);
   }
}
