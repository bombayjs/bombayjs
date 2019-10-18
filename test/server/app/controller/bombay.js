'use strict';

const Controller = require('egg').Controller;

class BombayController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.logger.info('ctx.request.body', ctx.request.body);
    ctx.logger.info('ctx.query', ctx.query);
    // 打印请求参数
    ctx.body = {
      resultCode: 200,
      data: {
        requestQuery: ctx.query,
        requsetBody: ctx.get('Content-Type') === 'text/plain' ? JSON.parse(ctx.request.body) : ctx.request.body,
      },
      message: 'success',
    };
  }
}

module.exports = BombayController;
