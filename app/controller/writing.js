const Controller = require("egg").Controller;
const moment = require("moment");
moment.locale("zh-cn");

class WritingController extends Controller {
  async index() {
    const { ctx, app } = this;
    let result = await app.model.Writing.findAll({
      limit: 10, //每页10条
      offset: ctx.query.page * 10, //第x页*每页个数
      // where: {},
      order: [["createdAt", "DESC"]],
      // 固定写法，完成模型之间联系后直接查询
      include: [
        {
          model: app.model.User,
        },
      ],
    });
    ctx.body = {
      data: result,
      status: 200,
    };
  }

  async getWritingByUserId() {
    const { ctx, app } = this;
    try {
      let result = await app.model.Writing.findAll({
        limit: 10, //每页10条
        offset: ctx.query.page * 10, //第x页*每页个数
        where: {
          user_id: ctx.query.userId,
        },
        order: [["createdAt", "DESC"]],
        // 固定写法，完成模型之间联系后直接查询
        include: [
          {
            model: app.model.User,
          },
        ],
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

  // 获取用户点赞writing
  async getUserLikeWriting() {
    const { ctx, app } = this;
    const idList = ctx.query.id.split(",");
    let resultList = [];
    for (let i = 0; i < idList.length; i++) {
      try {
        const result = await app.model.Writing.findByPk(idList[i], {
          include: [
            {
              model: app.model.User,
            },
          ],
        });
        resultList[i] = result;
        if (i === idList.length - 1) {
          ctx.body = {
            data: resultList,
            status: 200,
          };
        }
      } catch (error) {}
    }
  }

  // 最新热门
  async getNewHot() {
    const { ctx, app } = this;
    let result = await app.model.Writing.findAll({
      limit: 10, //每页10条
      offset: ctx.query.page * 10, //第x页*每页个数
      // where: {},
      order: [
        ["writing_comment_count", "DESC"],
        ["writing_like_count", "DESC"],
        ["createdAt", "DESC"],
      ],
      where: {
        createdAt: {
          [this.app.Sequelize.Op.between]: [
            moment(new Date())
              .subtract(15, "days")
              .format("YYYY-MM-DD HH:mm:ss"),
            moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
      },
      // 固定写法，完成模型之间联系后直接查询
      include: [
        {
          model: app.model.User,
        },
      ],
    });
    ctx.body = {
      data: result,
      status: 200,
    };
  }

  // 精选最新
  async getSiftNew() {
    const { ctx, app } = this;
    let result = await app.model.Writing.findAll({
      limit: 10, //每页10条
      offset: ctx.query.page * 10, //第x页*每页个数
      // where: {},
      order: [
        ["writing_comment_count", "DESC"],
        ["writing_like_count", "DESC"],
        ["createdAt", "DESC"],
      ],
      where: {
        createdAt: {
          [this.app.Sequelize.Op.between]: [
            moment(new Date())
              .subtract(3, "months")
              .format("YYYY-MM-DD HH:mm:ss"),
            moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
      },
      // 固定写法，完成模型之间联系后直接查询
      include: [
        {
          model: app.model.User,
        },
      ],
    });
    ctx.body = {
      data: result,
      status: 200,
    };
  }
  // 精选最热
  async getSiftHot() {
    const { ctx, app } = this;
    let result = await app.model.Writing.findAll({
      limit: 10, //每页10条
      offset: ctx.query.page * 10, //第x页*每页个数
      // where: {},
      order: [
        ["writing_comment_count", "DESC"],
        ["writing_like_count", "DESC"],
        ["createdAt", "DESC"],
      ],
      // 固定写法，完成模型之间联系后直接查询
      include: [
        {
          model: app.model.User,
        },
      ],
    });
    ctx.body = {
      data: result,
      status: 200,
    };
  }

  async getById() {
    const { ctx, app } = this;
    let result = await app.model.Writing.findOne({
      where: {
        id: ctx.query.id,
      },
      include: [
        {
          model: app.model.User,
        },
        {
          model: app.model.Comment,
          limit: 10, //每页10条
          offset: 0 * 10, //第x页*每页个数
          // where: {},
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: app.model.User,
            },
          ],
        },
      ],
    });
    ctx.body = {
      data: result,
      status: 200,
    };
  }

  async addWriting() {
    const { ctx, app } = this;
    const par = this.ctx.request.body;
    await app.model.Writing.create({
      user_id: par.userId,
      writing_tag: par.writingTag,
      writing_content: par.writingContent,
    });
    try {
      await app.model.User.findByPk(par.userId).then((user) => {
        return user.increment("myPublishNum");
      });
    } catch (error) {
      console.log(error);
      return null;
    }
    ctx.body = {
      data: "发表成功",
      status: 201,
    };
  }

  // 删除投稿
  async removeWriting() {
    const { ctx, app } = this;
    const writing = await ctx.model.Writing.findOne({
      where: { id: ctx.params.id },
      include: [
        {
          model: ctx.model.Comment,
        },
        {
          model: ctx.model.Like,
        },
      ],
    });
    let receiveCommentNum = 0;
    let receiveLikeNum = 0;
    for (const comment of writing.comments) {
      receiveCommentNum--;
      comment.destroy();
    }
    for (const like of writing.likes) {
      receiveLikeNum--;
      like.destroy();
    }

    await app.model.User.findByPk(writing.user_id).then((user) => {
      return user.increment("receiveCommentNum", {
        by: receiveCommentNum,
      });
    });
    await app.model.User.findByPk(writing.user_id).then((user) => {
      return user.increment("receiveLikeNum", {
        by: receiveLikeNum,
      });
    });
    await app.model.User.findByPk(writing.user_id).then((user) => {
      return user.increment("myPublishNum", {
        by: -1,
      });
    });
    writing.destroy();
    this.ctx.body = {
      data: {
        receiveCommentNum,
        receiveLikeNum,
      },
      status: 201,
    };
  }
}

module.exports = WritingController;
