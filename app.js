module.exports = (app) => {
  app.beforeStart(async function () {
    // 开发环境使用,会删除数据表
    // await app.model.sync({ force: true });
    await app.model.sync({});
  });
};
