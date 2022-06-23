"use strict";

const Controller = require("egg").Controller;

class UserController extends Controller {
  async index() {
    const { ctx, app } = this;
    let result = await app.model.User.findAll({});
    ctx.body = {
      data: result,
      status: 200,
    };
  }

  async getUserInfoById() {
    const { ctx, app } = this;
    try {
      let result = await app.model.User.findOne({
        where: {
          id: ctx.query.id,
        },
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

  async insetUser() {
    const { ctx, app } = this;
    let par = this.ctx.request.body;
    let result = await app.model.User.findCreateFind({
      where: {
        id: par.id,
      },
      defaults: {
        id: par.id,
        user_name: par.user_name,
        avatar_url: par.avatar_url,
        gender: par.gender,
      },
    });
    ctx.body = {
      data: "登录成功",
      status: 200,
    };
  }

  async updateUser() {
    const { ctx, app } = this;
    let par = this.ctx.request.body;
    let result = await app.model.User.update(
      {
        user_name: par.user_name,
        avatar_url: par.avatar_url,
        gender: par.gender,
      },
      {
        where: {
          id: par.id,
        },
      }
    );
    ctx.body = {
      data: "修改",
      status: 200,
    };
  }
  async updateUserComment() {
    const { ctx, app } = this;
    let par = this.ctx.request.body;
    let result = await app.model.User.update(
      {
        myCommentNum: par.myCommentNum,
      },
      {
        where: {
          id: par.id,
        },
      }
    );
    ctx.body = {
      data: "修改成功",
      status: 200,
    };
  }
}

module.exports = UserController;
