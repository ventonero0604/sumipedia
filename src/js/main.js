import $ from 'jquery';
import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import { validateName, validateEmail, validatePhoneNumber } from './validation.js';
import noUiSlider from 'nouislider';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'nouislider/dist/nouislider.css';

// お気に入りの総数を更新する関数
const updateFavoriteCount = () => {
  // 初期値を取得（初回のみ）
  if (!$('.js-fav-count').data('initial-count')) {
    const initialCount = parseInt($('.js-fav-count').text()) || 0;
    $('.js-fav-count').data('initial-count', initialCount);
  }

  const initialCount = $('.js-fav-count').data('initial-count');
  const currentFilledCount = $('.js-favorite.-filled').length;
  const totalCount = initialCount + currentFilledCount;

  $('.js-fav-count').text(totalCount);

  // 総数が0より多い場合は.is-showを付与
  if (totalCount > 0) {
    $('.js-fav-count').addClass('is-show');
  } else {
    $('.js-fav-count').removeClass('is-show');
  }
};

// 初期表示時にお気に入りの総数を設定
updateFavoriteCount();

// お気に入りボタンの処理
$('.js-favorite').on('click', function () {
  $(this).toggleClass('-filled');

  const $suggest = $(this).closest('.info').find('.js-suggest');
  if ($suggest.length) {
    $suggest.removeClass('is-show');
  }

  // お気に入りの総数を更新
  updateFavoriteCount();
});

// ギャラリーリストを閉じる処理
$('.js-close-gallery-list').on('click', function () {
  const $this = $(this);
  const $list = $this.prev('.list');

  $list.slideUp(300);
  $this.fadeOut(300);
});

// カード展開処理
$('.js-card-expand').on('click', function () {
  const $this = $(this);
  const $span = $this.find('span');

  // 初回クリック時に元のテキストを保存
  if (!$span.data('original-text')) {
    $span.data('original-text', $span.text());
  }

  $this.toggleClass('is-show');

  // 最も近い.A3_itemsから.js-items-expandを探す
  const $itemsContainer = $this.closest('.A3_items');
  const $itemsExpand = $itemsContainer.find('.js-items-expand');
  if ($itemsExpand.length) {
    $itemsExpand.slideToggle(300);
  }

  if ($this.hasClass('is-show')) {
    $span.text('閉じる');
  } else {
    $span.text($span.data('original-text'));
  }
});

// 物件ページ
if ($('.A1').length) {
  // チェックされたカードの総数を更新する関数
  const updateTotal = () => {
    const checkedCount = $('.Checkbox:checked').length;
    $('.js-total').text(checkedCount);
  };

  // 初期表示時に総数を設定
  updateTotal();

  // チェックボックスの変更を監視
  $('.Checkbox').on('change', updateTotal);

  // ソート変更時の処理
  $('.js-sort').on('change', function () {
    const selectedValue = $(this).val();

    // すべてのnoteから.is-showを削除
    $('.js-note').removeClass('is-show');

    // 選択された値に対応するnoteに.is-showを追加
    $(`.js-${selectedValue}`).addClass('is-show');
  });

  // 初期表示時に選択されているオプションのnoteを表示
  $('.js-sort').trigger('change');

  // オプションボタンのクリック処理
  $('.js-option-button').on('click', function () {
    $(this).toggleClass('selected');
  });
}

// 画像モーダル処理
$('.js-imageModal').on('click', function () {
  const $img = $(this).find('img');
  const imgSrc = $img.attr('src');
  const imgAlt = $img.attr('alt');

  // モーダルが存在しない場合は作成
  if (!$('#imageModal').length) {
    $('body').append(`
      <div id="imageModal" class="ImageModal">
        <button class="ImageModal_close js-modal-close"></button>
        <div class="ImageModal_content">
          <img src="" alt="">
        </div>
      </div>
    `);
  }

  // モーダルに画像を設定して表示
  $('#imageModal img').attr('src', imgSrc).attr('alt', imgAlt);
  $('#imageModal').addClass('is-show');
  $('body').css('overflow', 'hidden');

  // アニメーション用に少し遅延
  setTimeout(() => {
    $('#imageModal').addClass('is-visible');
  }, 10);
});

// モーダル表示処理
$('.js-modal-open').on('click', function () {
  $('#Modal').addClass('is-show');
  $('body').css('overflow', 'hidden');

  setTimeout(() => {
    $('#Modal').addClass('is-visible');
  }, 10);
});

// モーダルを閉じる処理
$(document).on('click', '.js-modal-close, #imageModal', function (e) {
  if ($(e.target).is('#imageModal') || $(e.target).hasClass('js-modal-close')) {
    $('#imageModal').removeClass('is-visible');

    setTimeout(() => {
      $('#imageModal').removeClass('is-show');
      $('body').css('overflow', '');
    }, 300);
  }
});

// ページトップへスクロール
$('.js-scrollToTop').on('click', function () {
  $('html, body').animate({ scrollTop: 0 }, 400);
});

// A2ページ
if ($('.A2').length) {
  // サムネイルスライダー
  const thumbnailSwiper = new Swiper('.thumbnail-swiper', {
    modules: [Thumbs],
    spaceBetween: 0,
    slidesPerView: 8,
    loop: true,
    watchSlidesProgress: true
  });

  // メインスライダー
  const mainSwiper = new Swiper('.main-swiper', {
    modules: [Navigation, Thumbs],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    thumbs: {
      swiper: thumbnailSwiper
    }
  });
}

// A3ページ
if ($('.A3').length) {
  // 現在のステップ状態を管理
  let currentStep = 1;

  // プレースホルダーの表示/非表示を制御する関数
  const updatePlaceholder = $input => {
    const $placeholder = $input.siblings('.placeholder');
    if ($input.val().trim() || $input.is(':focus')) {
      $placeholder.hide();
    } else {
      $placeholder.show();
    }
  };

  // 入力エリアの表示を切り替える関数
  const showInputStep = step => {
    $('.js-input-step-1, .js-input-step-2, .js-input-step-3').removeClass('is-active');
    $(`.js-input-step-${step}`).addClass('is-active');
    $(document.activeElement).blur();
  };

  // ステップ情報を更新する関数
  const updateStepInfo = step => {
    const remainingSteps = 4 - step;
    $('.js-steps').text(remainingSteps);

    // インジケーターを更新
    $('.A3_chat_input_indicator i').each(function (index) {
      if (index < step - 1) {
        $(this).addClass('is-active');
      }
    });
  };

  // 初期表示時にプレースホルダーの状態をチェック
  $('.js-input-field-1, .js-input-field-2, .js-input-field-3').each(function () {
    updatePlaceholder($(this));
  });

  // 入力フィールドの値監視
  $('.js-input-field-1, .js-input-field-2').on('input', function () {
    const $input = $(this);
    const $box = $input.closest('.box');
    const $error = $input.closest('.A3_chat_input_actions').find('.error');
    const $submitButton = $input.closest('.A3_chat_input_actions').find('.submit-button');

    // エラークラスをリセット
    $box.removeClass('is-error');
    $error.removeClass('is-show').text('');

    $submitButton.prop('disabled', !$input.val().trim());
    updatePlaceholder($input);
  });

  // ステップ3は任意なので常に送信可能
  $('.js-input-field-3').on('input', function () {
    const $input = $(this);
    const $box = $input.closest('.box');
    const $error = $input.closest('.A3_chat_input_actions').find('.error');

    // エラークラスをリセット
    $box.removeClass('is-error');
    $error.removeClass('is-show').text('');

    updatePlaceholder($input);
  });

  // フォーカス時の処理
  $('.js-input-field-1, .js-input-field-2, .js-input-field-3').on('focus', function () {
    $(this).siblings('.placeholder').hide();
  });

  // フォーカスアウト時の処理
  $('.js-input-field-1, .js-input-field-2, .js-input-field-3').on('blur', function () {
    updatePlaceholder($(this));
  });

  // メールアドレス入力フィールドのフォーカス時
  $('.js-input-field-2').on('focus', function () {
    $('.email-domains').addClass('is-show');
  });

  // メールアドレス入力フィールドのフォーカスアウト時
  $('.js-input-field-2').on('blur', function () {
    setTimeout(() => {
      $('.email-domains').removeClass('is-show');
    }, 200);
  });

  // メールドメイン選択
  $('.js-email-domain').on('click', function () {
    const domain = $(this).text().trim();
    const currentValue = $('.js-input-field-2').val().trim();
    const username = currentValue.split('@')[0];

    $('.js-input-field-2')
      .val(username + domain)
      .trigger('input');
    $('.email-domains').removeClass('is-show');
  });

  // 編集ボタンの処理
  $('.js-edit-button-1, .js-edit-button-2').on('click', function () {
    const $button = $(this);
    const stepNum = $button.hasClass('js-edit-button-1') ? 1 : 2;

    if ($button.hasClass('cancel')) {
      // キャンセル：元のステップに戻る
      $button.removeClass('cancel');
      $('.js-edit-button-1, .js-edit-button-2, .js-edit-button-3').removeClass('is-hidden');
      showInputStep(currentStep);
    } else {
      // 編集開始
      $button.addClass('cancel');
      // 他のステップの編集ボタンをリセット・非表示
      $('.js-edit-button-3').removeClass('cancel').addClass('is-hidden');
      const otherStepNum = stepNum === 1 ? 2 : 1;
      $(`.js-edit-button-${otherStepNum}`).addClass('is-hidden');
      showInputStep(stepNum);
      $('.A3').removeClass('is-complete');
    }
  });

  // ステップ情報を更新
  updateStepInfo(currentStep);

  // ステップ1の送信処理
  $('.js-submit-step-1').on('click', function () {
    const value = $('.js-input-field-1').val();
    const error = validateName(value);

    if (error) {
      const $box = $('.js-input-field-1').closest('.box');
      const $error = $('.js-input-error-1');

      $box.addClass('is-error');
      $error.text(error).addClass('is-show');
      return;
    }

    $('.js-step-1-answer-value').text(value.trim());
    $('.A3_complete_table .js-step-1-answer-value').text(value.trim());
    $('.js-step-1-answer').hide().addClass('is-active').fadeIn(300);

    // 編集状態をリセット
    $('.js-edit-button-1').removeClass('cancel');
    $('.js-edit-button-2').show();

    setTimeout(() => {
      if (currentStep === 1) {
        // 初回：step2へ進む
        currentStep = 2;
        $('.js-step-2-question').hide().addClass('is-active').fadeIn(300);
        updateStepInfo(2);
      }
      showInputStep(currentStep);
    }, 500);
  });

  // ステップ2の送信処理
  $('.js-submit-step-2').on('click', function () {
    const value = $('.js-input-field-2').val();
    const error = validateEmail(value);

    if (error) {
      const $box = $('.js-input-field-2').closest('.box');
      const $error = $('.js-input-error-2');

      $box.addClass('is-error');
      $error.text(error).addClass('is-show');
      return;
    }

    $('.js-step-2-answer-value').text(value.trim());
    $('.A3_complete_table .js-step-2-answer-value').text(value.trim());
    $('.js-step-2-answer').hide().addClass('is-active').fadeIn(300);

    // 編集状態をリセット
    $('.js-edit-button-2').removeClass('cancel');
    $('.js-edit-button-1').show();

    setTimeout(() => {
      currentStep = 3;
      $('.js-step-3-question').hide().addClass('is-active').fadeIn(300);
      $('.A3_chat_skip').addClass('is-active');
      updateStepInfo(3);
      showInputStep(3);
    }, 500);
  });

  // ステップ3の送信処理
  $('.js-submit-step-3').on('click', function () {
    const value = $('.js-input-field-3').val();
    const error = validatePhoneNumber(value);

    if (error) {
      const $box = $('.js-input-field-3').closest('.box');
      const $error = $('.js-input-error-3');

      $box.addClass('is-error');
      $error.text(error).addClass('is-show');
      return;
    }

    if (value.trim()) {
      $('.js-step-3-answer-value').text(value.trim());
      $('.A3_complete_table .js-step-3-answer-value').text(value.trim());
    }

    $('.js-step-3-answer').hide().addClass('is-active').fadeIn(300);

    // 編集状態をリセット
    $('.js-edit-button-3').removeClass('cancel');

    setTimeout(() => {
      $('.js-edit-button-1, .js-edit-button-2, .js-edit-button-3').removeClass('is-hidden');
      $('.A3').addClass('is-complete');
    }, 500);
  });

  // 編集ボタンの処理（ステップ3）
  $('.js-edit-button-3').on('click', function () {
    const $button = $(this);

    if ($button.hasClass('cancel')) {
      // キャンセル：元のステップに戻る
      $button.removeClass('cancel');
      $('.js-edit-button-1, .js-edit-button-2, .js-edit-button-3').removeClass('is-hidden');
      showInputStep(3);
    } else {
      // 編集開始
      $button.addClass('cancel');
      // 他のステップの編集ボタンをリセット・非表示
      $('.js-edit-button-1, .js-edit-button-2').removeClass('cancel').addClass('is-hidden');
      showInputStep(3);
      $('.A3').removeClass('is-complete');
    }
  });

  // スキップボタンの処理
  $('.A3_chat_skip').on('click', function () {
    $('.js-edit-button-1, .js-edit-button-2, .js-edit-button-3').removeClass('is-hidden');
    $('.A3').addClass('is-complete');
  });
}

if ($('.PrefList').length) {
  // アコーディオン処理
  $('.js-expand').on('click', function () {
    const $button = $(this);
    const $content = $button.next('.js-content');

    $button.toggleClass('is-open');

    if ($content.length) {
      $content.slideToggle(300);
    }
  });
}

// B2ページ
if ($('.B2').length) {
  // もっと見るボタンのアコーディオン処理
  $('.js-more').on('click', function () {
    const $button = $(this);
    const $expand = $button.prevAll('.js-expand').first();

    $button.toggleClass('is-open');

    if ($expand.length) {
      $expand.toggleClass('is-open');
    }
  });

  // 価格バーの幅を設定
  const setPriceBarWidth = () => {
    // 表示されているB2_tabs_detailのみを対象にする
    const $visibleDetail = $('.B2_tabs_detail.is-show');

    if ($visibleDetail.length === 0) return;

    // 既存の.is-highestクラスを削除
    $('.js-info').removeClass('is-highest');

    // 各ul内で処理
    $visibleDetail.each(function () {
      const $detail = $(this);
      const $prices = $detail.find('.js-price');

      if ($prices.length === 0) return;

      // このul内の全ての価格を取得して最大値を求める
      const prices = $prices
        .map(function () {
          return parseFloat($(this).text()) || 0;
        })
        .get();

      const maxPrice = Math.max(...prices);

      // 各バーの幅を設定
      $prices.each(function () {
        const price = parseFloat($(this).text()) || 0;
        const $info = $(this).closest('.js-info');
        const $bar = $info.find('.js-bar');
        const widthPercent = maxPrice > 0 ? (price / maxPrice) * 100 : 0;

        $bar.css('width', `${widthPercent}%`);

        // このul内の最高値に.is-highestクラスを付与
        if (price === maxPrice && maxPrice > 0) {
          $info.addClass('is-highest');
        }
      });
    });
  };

  // 初期表示時にバーの幅を設定
  setPriceBarWidth();

  // タブ切り替え処理
  $('.js-tab-switch').on('click', function () {
    const $button = $(this);
    const tabSwitch = $button.data('tab-switch');

    // すべてのタブボタンからis-activeを削除
    $('.js-tab-switch').removeClass('is-active');
    // クリックされたボタンにis-activeを追加
    $button.addClass('is-active');

    // すべてのタブコンテンツからis-showを削除
    $('.js-tab-content').removeClass('is-show');
    // 対応するdata-tab-contentを持つ要素にis-showを追加
    $(`.js-tab-content[data-tab-content="${tabSwitch}"]`).addClass('is-show');

    // 現在選択されているルームタイプを取得
    const activeRoomType = $('.js-room-type.is-active').data('room-select');

    // 表示されたタブ内の対応するルームタイプを表示
    const $activeTabContent = $(`.js-tab-content[data-tab-content="${tabSwitch}"]`);
    $activeTabContent.find('.B2_tabs_detail').removeClass('is-show');
    $activeTabContent
      .find(`.B2_tabs_detail[data-room-type="${activeRoomType}"]`)
      .addClass('is-show');

    // バー幅を再計算
    setPriceBarWidth();
  });

  // ルームタイプボタンのクリック処理
  $('.js-room-type').on('click', function () {
    const $button = $(this);
    const roomSelect = $button.data('room-select');

    // すべてのルームタイプボタンからis-activeを削除
    $('.js-room-type').removeClass('is-active');
    // クリックされたボタンにis-activeを追加
    $button.addClass('is-active');

    // 表示中のタブコンテンツ内の詳細を切り替え
    const $visibleTabContent = $('.js-tab-content.is-show');
    $visibleTabContent.find('.B2_tabs_detail').removeClass('is-show');
    $visibleTabContent.find(`.B2_tabs_detail[data-room-type="${roomSelect}"]`).addClass('is-show');

    // 表示されたコンテンツのバー幅を再計算
    setPriceBarWidth();
  });
}

// B4, B5ページ
if ($('.B4').length || $('.B5').length) {
  // 最高値・最安値にクラスを付与
  const setHighestLowest = () => {
    const $allRents = $('.avg-rent');

    if ($allRents.length === 0) return;

    // 既存のクラスを削除
    $allRents.removeClass('is-highest is-lowest');

    // 全ての家賃を数値として取得
    const rentsData = $allRents
      .map(function () {
        const text = $(this)
          .text()
          .replace(/[^0-9.]/g, '');
        return {
          element: $(this),
          value: parseFloat(text) || 0
        };
      })
      .get()
      .filter(item => item.value > 0);

    if (rentsData.length === 0) return;

    const maxRent = Math.max(...rentsData.map(item => item.value));
    const minRent = Math.min(...rentsData.map(item => item.value));

    // 最高値に最初に見つかった要素のみにクラスを付与
    const highestItem = rentsData.find(item => item.value === maxRent);
    if (highestItem) {
      highestItem.element.addClass('is-highest');
    }

    // 最安値に最初に見つかった要素のみにクラスを付与（最高値と同じでない場合）
    if (minRent !== maxRent) {
      const lowestItem = rentsData.find(item => item.value === minRent);
      if (lowestItem) {
        lowestItem.element.addClass('is-lowest');
      }
    }
  };

  // 初期表示時に最高値・最安値を設定
  setHighestLowest();

  // ラベルクリック時の処理
  $('.B4_list_label, .B5_list_label').on('click', function () {
    const $item = $(this).closest('li');
    const $checkbox = $(this).find('.Checkbox');

    // チェックボックスの状態が変わった後に処理するため少し遅延
    setTimeout(() => {
      if ($checkbox.is(':checked')) {
        $item.addClass('is-selected');
      } else {
        $item.removeClass('is-selected');
      }

      // ボタンの表示/非表示を更新
      updateButtonsVisibility();
    }, 0);
  });

  // ボタンの表示/非表示を更新する関数
  const updateButtonsVisibility = () => {
    const checkedCount = $('.js-list .Checkbox:checked').length;

    if (checkedCount > 0) {
      $('.js-buttons').css('display', 'flex');
    } else {
      $('.js-buttons').css('display', 'none');
    }
  };

  // 初期表示時にボタンの状態を設定
  updateButtonsVisibility();

  // B5専用: アコーディオン処理
  if ($('.B5').length) {
    // エキスパンドの開閉（ラベルクリック時、チェックボックス以外）
    $('.B5_expand_item .js-expand').on('click', function (e) {
      // チェックボックスがクリックされた場合は処理しない
      if ($(e.target).hasClass('Checkbox')) {
        return;
      }

      e.preventDefault();

      const $label = $(this);
      const $item = $label.closest('.B5_expand_item');
      const $list = $item.find('.B5_list');
      const isOpen = $item.hasClass('is-expand');

      // アコーディオンの開閉のみ
      if (isOpen) {
        $item.removeClass('is-expand');
        $list.slideUp(300);
      } else {
        $item.addClass('is-expand');
        $list.slideDown(300, function () {
          $(this).css('display', 'grid');
        });
      }
    });

    // 親チェックボックスクリック時：直下のリストのチェックボックスを全てチェック/解除
    $('.B5_expand_item .js-expand .Checkbox').on('change', function (e) {
      e.stopPropagation();

      const $checkbox = $(this);
      const $item = $checkbox.closest('.B5_expand_item');
      const $list = $item.find('.B5_list');
      const $childCheckboxes = $list.find('.Checkbox');
      const isChecked = $checkbox.is(':checked');

      // 直下のリストのチェックボックスを全て同じ状態にする
      $childCheckboxes.prop('checked', isChecked);

      // 選択状態のクラスも更新
      if (isChecked) {
        $list.find('.B5_list_item').addClass('is-selected');

        // チェックされた場合、エキスパンドが閉じていたら開く
        if (!$item.hasClass('is-expand')) {
          $item.addClass('is-expand');
          $list.slideDown(300, function () {
            $(this).css('display', 'grid');
          });
        }
      } else {
        $list.find('.B5_list_item').removeClass('is-selected');
      }

      // ボタンの表示/非表示を更新
      updateButtonsVisibility();
    });

    // 子チェックボックス変更時：親チェックボックスの状態を更新
    $('.B5_expand_item .B5_list .Checkbox').on('change', function () {
      const $item = $(this).closest('.B5_expand_item');
      const $list = $item.find('.B5_list');
      const $parentCheckbox = $item.find('.js-expand .Checkbox');
      const $childCheckboxes = $list.find('.Checkbox');
      const checkedCount = $childCheckboxes.filter(':checked').length;

      // 一つでもチェックがあれば親もチェック、なければ解除
      if (checkedCount > 0) {
        $parentCheckbox.prop('checked', true);
      } else {
        $parentCheckbox.prop('checked', false);
      }

      // ボタンの表示/非表示を更新
      updateButtonsVisibility();
    });
  }
}

// B6ページ
if ($('.B6').length) {
  const rangeSlider = document.getElementById('range');

  if (rangeSlider) {
    // 賃料の値リスト（万円）
    const priceValues = [
      3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13,
      13.5, 14, 14.5, 15, 16, 17, 18, 19, 20, 25, 30, 35, 40, 50, 100
    ];

    // 数値を小数点1桁でフォーマット
    const formatPrice = value => {
      return value.toFixed(1);
    };

    // スライダーを初期化
    noUiSlider.create(rangeSlider, {
      start: [0, priceValues.length - 1],
      connect: true,
      step: 1,
      range: {
        min: 0,
        max: priceValues.length - 1
      }
    });

    // 値の更新処理
    const updatePriceDisplay = values => {
      const lowerIndex = Math.round(values[0]);
      const upperIndex = Math.round(values[1]);

      const $lowerPrice = $('#rlPrice');
      const $upperPrice = $('#ruPrice');

      // 下限値の表示
      if (lowerIndex === 0) {
        $lowerPrice.text('下限なし');
      } else {
        const lowerValue = priceValues[lowerIndex];
        $lowerPrice.text(`${formatPrice(lowerValue)}万円以上`);
      }

      // 上限値の表示
      if (upperIndex === priceValues.length - 1) {
        $upperPrice.text('上限なし');
      } else {
        const upperValue = priceValues[upperIndex];
        $upperPrice.text(`${formatPrice(upperValue)}万円以下`);
      }
    };

    // スライダー更新時のイベント
    rangeSlider.noUiSlider.on('update', values => {
      updatePriceDisplay(values);
    });
  }

  // 徒歩分数スライダー
  const walkingSlider = document.getElementById('range-walking');

  if (walkingSlider) {
    // 徒歩分数の値リスト
    const walkingValues = [1, 3, 5, 7, 10, 15, 20, null]; // nullは「指定なし」

    // スライダーを初期化
    noUiSlider.create(walkingSlider, {
      start: [walkingValues.length - 1],
      connect: [true, false],
      step: 1,
      range: {
        min: 0,
        max: walkingValues.length - 1
      }
    });

    // 値の更新処理
    const updateWalkingDisplay = values => {
      const index = Math.round(values[0]);
      const $walkingTime = $('#wkTime');

      if (walkingValues[index] === null) {
        $walkingTime.text('指定なし');
      } else {
        $walkingTime.text(`${walkingValues[index]}分以内`);
      }
    };

    // スライダー更新時のイベント
    walkingSlider.noUiSlider.on('update', values => {
      updateWalkingDisplay(values);
    });
  }

  // 築年数スライダー
  const buildingSlider = document.getElementById('range-building');

  if (buildingSlider) {
    // 築年数の値リスト（0は新築、nullは指定なし）
    const buildingValues = [0, 1, 3, 5, 7, 10, 15, 20, 25, 30, null];

    // スライダーを初期化
    noUiSlider.create(buildingSlider, {
      start: [buildingValues.length - 1],
      connect: [true, false],
      step: 1,
      range: {
        min: 0,
        max: buildingValues.length - 1
      }
    });

    // 値の更新処理
    const updateBuildingDisplay = values => {
      const index = Math.round(values[0]);
      const $buildingAge = $('#buildingAge');

      if (buildingValues[index] === null) {
        $buildingAge.text('指定なし');
      } else if (buildingValues[index] === 0) {
        $buildingAge.text('新築');
      } else {
        $buildingAge.text(`${buildingValues[index]}年以内`);
      }
    };

    // スライダー更新時のイベント
    buildingSlider.noUiSlider.on('update', values => {
      updateBuildingDisplay(values);
    });
  }

  // 専有面積スライダー
  const areaSlider = document.getElementById('range-area');

  if (areaSlider) {
    // 専有面積の値リスト（㎡）
    const areaValues = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100];

    // スライダーを初期化
    noUiSlider.create(areaSlider, {
      start: [0, areaValues.length - 1],
      connect: true,
      step: 1,
      range: {
        min: 0,
        max: areaValues.length - 1
      }
    });

    // 値の更新処理
    const updateAreaDisplay = values => {
      const lowerIndex = Math.round(values[0]);
      const upperIndex = Math.round(values[1]);

      const $lowerArea = $('#alArea');
      const $upperArea = $('#auArea');

      // 下限値の表示
      if (lowerIndex === 0) {
        $lowerArea.text('下限なし');
      } else {
        $lowerArea.text(`${areaValues[lowerIndex]}㎡以上`);
      }

      // 上限値の表示
      if (upperIndex === areaValues.length - 1) {
        $upperArea.text('上限なし');
      } else {
        $upperArea.text(`${areaValues[upperIndex]}㎡以下`);
      }
    };

    // スライダー更新時のイベント
    areaSlider.noUiSlider.on('update', values => {
      updateAreaDisplay(values);
    });
  }

  // 全てのこだわり条件アコーディオン
  $('.js-expand-button').on('click', function () {
    const $button = $(this);
    const $expand = $('.B6 .js-expand');

    $button.toggleClass('is-expand');

    if ($button.hasClass('is-expand')) {
      $expand.slideDown(300);
      $button.text('こだわり条件を閉じる');
    } else {
      $expand.slideUp(300);
      $button.text('全てのこだわり条件');
    }
  });
}

// C1, C2ページ
if ($('.C1').length || $('.C2').length) {
  // お問い合わせボタンの状態を更新する関数
  const updateContactButtonState = () => {
    const checkedCount = $('.CardFavoriteHistory .Checkbox:checked').length;

    if (checkedCount > 0) {
      $('.js-contact-button').removeClass('is-disabled');
    } else {
      $('.js-contact-button').addClass('is-disabled');
    }
  };

  // チェックボックスの変更を監視
  $(document).on('change', '.CardFavoriteHistory .Checkbox', function () {
    updateContactButtonState();
  });

  // 初期表示時にボタンの状態を設定
  updateContactButtonState();
}

// D3ページのファイルアップロード処理
if (document.querySelector('.D3')) {
  const uploadInputs = document.querySelectorAll('.D3_upload_input');

  uploadInputs.forEach(input => {
    input.addEventListener('change', handleFileSelect);
  });

  function handleFileSelect(e) {
    const input = e.target;
    const file = input.files[0];
    if (!file) return;

    const parentLi = input.closest('li');
    const confirmDiv = parentLi.querySelector('.confirm');

    if (!confirmDiv) return;

    const thumb = confirmDiv.querySelector('.thumb');
    const fileInfoP = confirmDiv.querySelector('.file-info');

    // サムネイル画像を作成
    const reader = new FileReader();
    reader.onload = event => {
      thumb.innerHTML = `<img src="${event.target.result}" alt="${file.name}">`;
    };
    reader.readAsDataURL(file);

    // ファイル名とサイズを表示
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    fileInfoP.textContent = `${file.name}(${fileSizeMB}MB)`;

    // .confirmを表示
    confirmDiv.style.display = 'block';
  }

  // 修正ボタンのクリック処理
  $('.js-fix').on('click', function () {
    const $confirm = $(this).closest('.confirm');
    const $apply = $confirm.siblings('.apply');

    $confirm.hide();
    $apply.css('display', 'flex');

    // .is-confirmから.is-applyに変更
    $('.D3').removeClass('is-confirm').addClass('is-apply');
  });

  // 申請ボタンのクリック処理
  $('.js-submit').on('click', function () {
    // 白いオーバーレイを作成して追加
    const $overlay = $('<div class="page-transition-overlay"></div>').css({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
      zIndex: 9999,
      opacity: 0
    });
    $('body').append($overlay);

    // フェードイン
    $overlay.animate({ opacity: 1 }, 300, function () {
      // ページトップにスクロール
      $(window).scrollTop(0);

      // .confirmを表示
      $('.D3 .confirm').show();

      // .is-applyから.is-confirmに変更
      $('.D3').removeClass('is-apply').addClass('is-confirm');

      // D3_form_group内のinput, selectをdisabledに
      $('.D3_form_group input, .D3_form_group select').prop('disabled', true);

      // js-bank-fixを表示
      $('.js-bank-fix').removeClass('hidden').show();

      // フェードアウト
      $overlay.animate({ opacity: 0 }, 300, function () {
        $overlay.remove();
      });
    });
  });

  // 口座情報の修正ボタンのクリック処理
  $('.js-bank-fix').on('click', function () {
    // D3_form_group内のinput, selectのdisabledを解除
    $('.D3_form_group input, .D3_form_group select').prop('disabled', false);

    // 自身を非表示
    $(this).hide();

    // .is-confirmから.is-applyに変更
    $('.D3').removeClass('is-confirm').addClass('is-apply');
  });
}
