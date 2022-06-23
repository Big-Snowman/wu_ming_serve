"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.post("/wxlogin/openid", controller.login.wxOpenid);
  router.get("/", controller.user.index);
  router.get("/userbyid", controller.user.getUserInfoById);
  router.post("/", controller.user.insetUser);
  router.post("/updateUser", controller.user.updateUser);
  router.post("/updateUserComment", controller.user.updateUserComment);
  router.get("/writing", controller.writing.index);
  router.get(
    "/writing/getWritingByUserId",
    controller.writing.getWritingByUserId
  );
  router.get("/writing/getNewHot", controller.writing.getNewHot);
  router.get("/writing/getSiftNew", controller.writing.getSiftNew);
  router.get("/writing/getSiftHot", controller.writing.getSiftHot);
  router.get("/writing/byId", controller.writing.getById);
  router.get(
    "/writing/getUserLikeWriting",
    controller.writing.getUserLikeWriting
  );
  router.post("/writing", controller.writing.addWriting);
  router.delete("/writing/:id", controller.writing.removeWriting);
  router.post("/like", controller.like.like);
  router.get("/like", controller.like.index);
  router.get("/like/getLikeById", controller.like.getLikeById);
  router.post("/comment", controller.comment.comment);
  router.get("/comment", controller.comment.index);
  router.delete("/comment/:id/:writing_id", controller.comment.removeComment);
  router.get(
    "/comment/getCommentByUserId",
    controller.comment.getCommentByUserId
  );
};
