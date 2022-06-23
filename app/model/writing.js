module.exports = (app) => {
  const { STRING, UUID, TEXT, UUIDV4, INTEGER } = app.Sequelize;
  // 默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数)转换为复数
  const Writing = app.model.define("writing", {
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
    writing_tag: {
      type: STRING,
    },
    writing_content: {
      type: TEXT,
      allowNull: false,
    },
    writing_views: {
      type: INTEGER,
      defaultValue: 0,
    },
    writing_comment_count: {
      type: INTEGER,
      defaultValue: 0,
    },
    writing_like_count: {
      type: INTEGER,
      defaultValue: 0,
    },
  });

  Writing.associate = function () {
    // 学生与班级是多对一， belongsTo属于谁
    // 学生属于班级，学生是次，班级是主，foreignKey在学生里面找，targetKey在班级找
    app.model.Writing.belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });

    app.model.Writing.hasMany(app.model.Like, {
      foreignKey: "writing_id",
      targetKey: "id",
    });

    app.model.Writing.hasMany(app.model.Comment, {
      foreignKey: "writing_id",
      targetKey: "id",
      // foreignKey: "id",
      // targetKey: "writing_id",
    });
  };

  // Writing.associate = function () {
  //   // 课程和学生一对多，用hasmany，用学生的clazz_id作为外键参考,和自己的id字段匹配
  //   // clazz 有很多 Student, clazz当作是集合(主)，student当作是元素(次)
  //   // 知道主次就能较好的记忆了
  //   // targetKey当作是班级牌号，foreignKey当作是学生找班牌号的参考
  //   // 理解成把学生按照什么分类到班级里去，就稍微好记一点
  //   app.model.Writing.hasMany(app.model.Like, {
  //     foreignKey: "id",
  //     targetKey: "writing_id",
  //   });
  // };

  return Writing;
};
