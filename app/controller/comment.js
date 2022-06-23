const Controller = require("egg").Controller;

class CommentController extends Controller {
  async index() {
    const { ctx, app } = this;
    try {
      let result = await app.model.Comment.findAll({
        limit: 10, //每页10条
        offset: ctx.query.page * 10, //第x页*每页个数
        // where: {},
        order: [["createdAt", "DESC"]],
        where: {
          writing_id: ctx.query.writingId,
        },
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

  async getCommentByUserId() {
    const { ctx, app } = this;
    try {
      const result = await this.app.model.Comment.findAndCountAll({
        where: {
          user_id: ctx.query.userId,
          // writing_id: ctx.query.writingId,
        },
        limit: 10, //每页10条
        offset: ctx.query.page * 10, //第x页*每页个数
      });
      ctx.body = {
        data: result,
        status: 200,
      };
    } catch (e) {
      return null;
    }
  }

  // 删除评论
  async removeComment() {
    const { ctx } = this;
    await ctx.model.Comment.destroy({
      where: { id: ctx.params.id },
    });
    await ctx.model.Writing.findByPk(ctx.params.writing_id).then((writing) => {
      return writing.increment("writing_comment_count", {
        by: -1,
      });
    });
    this.ctx.body = {
      message: "删除评论成功",
      status: 201,
    };
  }

  // 写入评论
  async comment() {
    const { ctx, app } = this;
    const par = this.ctx.request.body;
    try {
      await app.model.Comment.create({
        user_id: par.user_id,
        writing_id: par.writing_id,
        comment: par.comment,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
    // 评论数加一
    try {
      await app.model.Writing.findByPk(par.writing_id).then((writing) => {
        return writing.increment("writing_comment_count");
      });
    } catch (error) {
      console.log(error);
      return null;
    }
    // 发表者收到评论数加一
    try {
      await app.model.User.findByPk(par.writer).then((user) => {
        return user.increment("receiveCommentNum");
      });
    } catch (error) {
      console.log(error);
      return null;
    }
    // 用户的评论数加一
    try {
      await app.model.User.findByPk(par.user_id).then((user) => {
        return user.increment("myCommentNum");
      });
    } catch (error) {
      console.log(error);
      return null;
    }
    ctx.body = {
      data: "评论成功",
      status: 200,
    };
  }
}

module.exports = CommentController;
