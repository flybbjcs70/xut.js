 import { config } from '../../../../config/index'

/**
 * 解析canvas配置
 * contentMode 分为  0 或者 1
 * 1 是dom模式
 * 0 是canvas模式
 * 以后如果其余的在增加
 * 针对页面chapter中的parameter写入 contentMode   值为 1
 * 针对每一个content中的parameter写入 contentMode 值为 1
 * 如果是canvas模式的时候，同时也是能够存在dom模式是
 * @return {[type]} [description]
 */
export default function parseContentMode(pageData, base) {
  let parameter = pageData.parameter
  if (parameter) {
    try {
      parameter = JSON.parse(parameter)
      if (parameter) {
        if (parameter.contentMode && parameter.contentMode == 1) {
          //非强制dom模式
          if (!config.debug.onlyDomMode) {
            //启动dom模式
            base.canvasRelated.enable = true;
          }
        }
        //如果是最后一页处理
        if (parameter.lastPage && base.pageType === 'page') {
          //运行应用运行时间
          base.runLastPageAction = function () {
            const runTime = Number(config.data.delayTime)
            let timeout
            if (runTime) {
              timeout = setTimeout(() => {
                  Xut.Application.Notify('complete')
                }, runTime * 1000) //转成秒
            }
            return function () { //返回停止方法
              if (timeout) {
                clearTimeout(timeout)
                timeout = null
              }
            }
          }

        }
      }
    } catch (e) {
      console.log('JSON错误,chpterId为', base.chapterId, parameter)
    }
  }
}
