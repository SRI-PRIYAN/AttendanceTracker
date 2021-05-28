const getObjectsFromCSV = (Readable, csv, buffer) => {
  let result = [];

  return new Promise((resolve, reject) => {
    Readable.from(buffer)
      .pipe(csv())
      .on("error", (err) => reject(err))
      .on("data", (data) => {
        if (Object.keys(data).length !== 0) result.push(data);
      })
      .on("end", () => resolve(result));
  });
};

module.exports = { getObjectsFromCSV };
