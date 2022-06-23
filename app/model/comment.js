module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;
  // 默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数)转换为复数
  const Comment = app.model.define("comment", {
    id: {
      // type: UUID,
      // defaultValue: UUIDV4,
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: STRING,
      allowNull: false,
    },
    writing_id: {
      type: INTEGER,
      allowNull: false,
    },
    comment: {
      type: STRING,
      allowNull: false,
    },
  });

  Comment.associate = function () {
    // 学生与班级是多对一， belongsTo属于谁
    // 学生属于班级，学生是次，班级是主，foreignKey在学生里面找，targetKey在班级找
    app.model.Comment.belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });

    app.model.Comment.belongsTo(app.model.Writing, {
      foreignKey: "writing_id",
      targetKey: "id",
    });

    //   app.model.Comment.belongsTo(app.model.User, {
    //     foreignKey: "user_id",
    //     targetKey: "id",
    //   });
  };

  // Comment.associate = function () {
  //   // 学生与班级是多对一， belongsTo属于谁
  //   // 学生属于班级，学生是次，班级是主，foreignKey在学生里面找，targetKey在班级找
  //   app.model.Comment.belongsTo(app.model.Writing, {
  //     foreignKey: "writing_id",
  //     targetKey: "id",
  //   });
  // };

  // Comment.associate = function () {
  //   // 学生与班级是多对一， belongsTo属于谁
  //   // 学生属于班级，学生是次，班级是主，foreignKey在学生里面找，targetKey在班级找
  //   app.model.Comment.belongsTo(app.model.User, {
  //     foreignKey: "user_id",
  //     targetKey: "id",
  //   });
  // };

  return Comment;
};
