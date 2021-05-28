const { getClassId } = require("../helpers/getClassId");
const { getObjectsFromCSV } = require("../helpers/getObjectsFromCSV");

const handleStudentFileUpload = (db, Readable, csv) => async (req, res) => {
  if (!req.files.studentFile.name.endsWith(".csv")) {
    return res.status(400).json({ message: "Only CSV files are accepted!" });
  }

  const { className } = req.body;
  const user = JSON.parse(req.body.user);

  try {
    const class_id = await getClassId(db, className, user.faculty_id);
    console.log(`class_id: ${class_id}`);

    const students = await getObjectsFromCSV(
      Readable,
      csv,
      req.files.studentFile.data
    );

    await db.transaction(async (trx) => {
      for (const student of students) {
        const { student_id } = (
          await trx("student")
            .insert(student)
            .onConflict("email")
            .merge()
            .returning(["student_id"])
        )[0];

        await trx("belongsto")
          .insert({ student_id, class_id })
          .onConflict(["student_id", "class_id"])
          .ignore();
      }
    });

    const insertedStudents = await db
      .select("student.rollno", "student.name", "email", "year")
      .from("class_students")
      .innerJoin("class", { "class_students.class_id": "class.class_id" })
      .innerJoin("student", {
        "class_students.student_id": "student.student_id",
      })
      .where({ "class.class_id": class_id });

    return res
      .status(201)
      .json({ title: `Students of ${className}`, table: insertedStudents });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: `${err.detail || err.message || err}` });
  }
};

module.exports = { handleStudentFileUpload };
