/*==================================================*\
        Greatbox
\*==================================================*/
;(function($) {
  let announcement = false

  // 一次性顯示/無綁定元素
  $.greatbox = function(userOpts, callback) {
    userOpts.announcement = true
    $.fn.greatbox(userOpts, callback)
  }

  // 綁定事件 greatbox
  $.fn.greatbox = function(userOpts = {}, callback = () => {}) {
    /* 預設樣板 */
    const boxTemp = `
      <div class="greatbox">
        <div class="gb-container">
          <div class="gb-content"></div>
        </div>
      </div>
    `
    const closeBtnTemp = `<div class="gb-close-btn"></div>`
    const loadingTemp = `
      <div class="gb-loading">
        <svg><path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"><animateTransform attributeType="xml"attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/></path></svg>
      </div>
    `

    /* 預設選項 */
    const _defaultOpts = {
      path: {
        filesRoot: './includes/greatbox/',
        filesDefaultExtension: '.html'
      },
      announcement: false,
      fileName: [],
      contentType: 'file',
      bindEvt: 'click',
      closeBtn: true,
      bodyClickClose: true,
      showWhenLanding: false,
      duration: 200,
      boxTemp: boxTemp,
      closeBtnTemp: closeBtnTemp,
      loadingTemp: loadingTemp,
      callback: () => {}
    }

    // Options Extend
    const opts = $.extend(_defaultOpts, userOpts)
    // 如果不要關閉按鈕，則強制開啟 "點擊 body 可關閉 lightbox" 功能
    !opts.closeBtn && (opts.bodyClickClose = true)

    const init = (idx, el) => {
      const $el = $(el)
      $el.click(evt => {
        evt.stopPropagation()
      })
      opts.fileName.push($el.data('gb'))
      opts.announcement
        ? buildTemp(idx)
        : $el.on(opts.bindEvt, () => {
            if (!!$('.greatbox').length) throw new Error('已有 Greatbox 存在')
            buildTemp(idx)
          })
    }

    /*==================== Methods ====================*/
    // 建立模組
    const buildTemp = idx => {
      $('body').append(opts.boxTemp)
      $('.greatbox')
        .append(opts.loadingTemp)
        .addClass(opts.fileName[idx])
      opts.closeBtn && $('.gb-container').append(opts.closeBtnTemp)

      tempEvtBing()
      loadFile(idx, loadFileCallback)
    }

    /* Content Show/Hide */
    const loadFileCallback = () => {
      $('.gb-container img').on('load', () => {
        $('.gb-container')
          .stop()
          .animate(
            {
              opacity: 1
            },
            opts.duration
          )
        $('.gb-loading')
          .stop()
          .animate(
            {
              opacity: 0
            },
            opts.duration
          )
      })
    }

    /* Template Events Bingind */
    const tempEvtBing = () => {
      // Container Stop Propagation
      $('.gb-container').click(evt => {
        evt.stopPropagation()
      })

      opts.closeBtn && $('.gb-close-btn').click(closeGB)
      opts.bodyClickClose && $('body').click(closeGB)

      $('.greatbox').fadeIn(opts.duration)
    }

    /* 取得完整路徑 */
    const getFullPath = idx => {
      const { filesRoot: root, filesDefaultExtension: ext } = opts.path

      return `${root}${opts.fileName[idx]}${ext}`
    }

    /* Download File */
    const loadFile = (idx, callback) => {
      $('.gb-content').load(getFullPath(idx), callback)
    }

    /* Close Greatbox */
    const closeGB = () => {
      const $gb = $('.greatbox')
      if (!$gb.length) return false
      // 需調整: 開放使用者自定義
      $gb.fadeOut(opts.duration, () => {
        $gb.remove()
      })
    }

    /*==================== Entrance ====================*/
    $.each([].slice.call(this), init)
    return this
  }
})(jQuery)
