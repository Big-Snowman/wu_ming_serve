module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;
  // 默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数)转换为复数
  const User = app.model.define("user", {
    id: {
      type: STRING,
      // defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_name: {
      type: STRING,
      allowNull: false,
    },
    avatar_url: {
      type: STRING,
    },
    gender: {
      type: STRING,
    },
    myPublishNum: {
      type: INTEGER,
      defaultValue: 0,
    },
    myCommentNum: {
      type: INTEGER,
      defaultValue: 0,
    },
    receiveLikeNum: {
      type: INTEGER,
      defaultValue: 0,
    },
    receiveCommentNum: {
      type: INTEGER,
      defaultValue: 0,
    },
  });

  User.associate = function () {
    app.model.User.hasMany(app.model.Like, {
      foreignKey: "user_id",
      targetKey: "id",
    });

    app.model.User.hasMany(app.model.Writing, {
      foreignKey: "user_id",
      targetKey: "id",
    });

    app.model.User.hasMany(app.model.Comment, {
      foreignKey: "user_id",
      targetKey: "id",
      // foreignKey: "id",
      // targetKey: "writing_id",
    });
  };

  return User;
};
