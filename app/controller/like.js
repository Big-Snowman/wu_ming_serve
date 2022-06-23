const Controller = require("egg").Controller;

class LikeController extends Controller {
  async index() {
    const { ctx, app } = this;
    try {
      let result = await app.model.Like.findAll({
        where: {
          user_id: ctx.query.userId,
        },
        order: [["createdAt", "DESC"]],
      });
      ctx.body = {
        data: result,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getLikeById() {
    const { ctx, app } = this;
    try {
      const result = await this.app.model.Like.findOne({
        where: {
          user_id: ctx.query.userId,
          writing_id: ctx.query.writingId,
        },
      });
      ctx.body = {
        data: result,
        status: 200,
      };
    } catch (e) {
      return null;
    }
  }

  // 点赞
  async like() {
    const { ctx, app } = this;
    const par = this.ctx.request.body;
    if (par.condition === "1") {
      try {
        await app.model.Like.findCreateFind({
          where: {
            user_id: par.user_id,
            writing_id: par.writing_id,
          },
          default: {
            user_id: par.user_id,
            writing_id: par.writing_id,
          },
        });
      } catch (error) {
        console.log(error);
        return null;
      }
    } else {
      try {
        await app.model.Like.destroy({
          where: {
            user_id: par.user_id,
            writing_id: par.writing_id,
          },
        });
      } catch (error) {
        console.log(error);
        return null;
      }
    }
    // 文案点赞数增减
    try {
      const flag = par.condition === "1" ? 1 : -1;
      await app.model.Writing.findByPk(par.writing_id).then((writing) => {
        return writing.increment("writing_like_count", {
          by: flag,
        });
      });
    } catch (error) {
      console.log(error);
      return null;
    }
    // 用户点赞数增减
    try {
      const flag = par.condition === "1" ? 1 : -1;
      await app.model.User.findByPk(par.writer).then((user) => {
        return user.increment("receiveLikeNum", {
          by: flag,
        });
      });
    } catch (error) {
      console.log(error);
      return null;
    }
    ctx.body = {
      data: "成功",
      status: 200,
    };
  }
}

module.exports = LikeController;
