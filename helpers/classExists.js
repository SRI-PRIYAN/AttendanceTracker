const classExists = (db, subject, faculty_id) => {
  return new Promise((resolve, reject) => {
    db.select("class_id")
      .from("class")
      .where({ subject, faculty_id })
      .then((table) => resolve(table.length !== 0))
      .catch(reject);
  });
};

module.exports = { classExists };
