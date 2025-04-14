/**
 * ウェルテラス トレーナーLP JavaScript
 * 
 * 機能:
 * - ヘッダースクロール時の動作
 * - ハンバーガーメニューの開閉
 * - スムーズスクロール
 * - よくある質問のアコーディオン
 * - 料金タブの切り替え
 * - フォームのバリデーション
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初期化
    initializeApp();
  });
  
  /**
   * アプリケーション初期化
   */
  function initializeApp() {
    // 各機能の初期化
    initializeHeader();
    initializeHamburgerMenu();
    initializeSmoothScroll();
    initializeAccordion();
    initializePricingTabs();
    initializeForms();
  
    // AOSライブラリが存在する場合のみ初期化
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  
  /**
   * ヘッダー挙動の初期化
   */
  function initializeHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    // スクロール時のヘッダー変化
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    });
    
    // 初期読み込み時に現在のスクロール位置をチェック
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    }
  }
  
  /**
   * ハンバーガーメニューの初期化
   */
  function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.header__nav');
    
    if (!hamburger || !nav) return;
    
    // ハンバーガーメニューのクリックイベント
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
    
    // メニューリンククリック時にメニューを閉じる
    const navLinks = document.querySelectorAll('.header__nav-list li a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
    
    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', function() {
      if (window.innerWidth > 991) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }
  
  /**
   * スムーズスクロールの初期化
   */
  function initializeSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // #のみの場合は処理しない
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) return;
        
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }
  
  /**
   * よくある質問アコーディオンの初期化
   */
  function initializeAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-item__question');
      const answer = item.querySelector('.faq-item__answer');
      
      if (!question || !answer) return;
      
      // 最初のアイテムを開いた状態にする（オプション）
      if (item === faqItems[0]) {
        item.classList.add('active');
        answer.style.height = answer.scrollHeight + 'px';
      }
      
      question.addEventListener('click', function() {
        // クリックされたアイテムの現在の状態を確認
        const isActive = item.classList.contains('active');
        
        // すべてのアイテムを閉じる
        faqItems.forEach(faq => {
          faq.classList.remove('active');
          const faqAnswer = faq.querySelector('.faq-item__answer');
          if (faqAnswer) faqAnswer.style.height = '0';
        });
        
        // クリックされたアイテムが閉じていた場合は開く
        if (!isActive) {
          item.classList.add('active');
          answer.style.height = answer.scrollHeight + 'px';
        }
      });
    });
  }
  
  /**
   * 料金プランタブの初期化
   */
  function initializePricingTabs() {
    const tabs = document.querySelectorAll('.pricing__tab');
    const monthlyPlans = document.querySelector('.pricing__plans');
    const yearlyPlans = document.querySelector('.pricing__plans--yearly');
    
    if (!tabs.length || !monthlyPlans) return;
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // アクティブなタブのクラスを切り替える
        tabs.forEach(t => t.classList.remove('pricing__tab--active'));
        this.classList.add('pricing__tab--active');
        
        // プランの表示を切り替える
        const selectedTab = this.getAttribute('data-tab');
        
        if (selectedTab === 'monthly') {
          monthlyPlans.style.display = 'grid';
          if (yearlyPlans) yearlyPlans.style.display = 'none';
        } else {
          monthlyPlans.style.display = 'none';
          if (yearlyPlans) yearlyPlans.style.display = 'grid';
        }
      });
    });
  }
  
  /**
   * フォームの初期化
   */
  function initializeForms() {
    const downloadForm = document.querySelector('.download__form');
    const contactForm = document.querySelector('.contact__form');
    
    // 資料ダウンロードフォームの処理
    if (downloadForm) {
      downloadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // バリデーションチェック
        if (validateForm(this)) {
          // 成功時の処理（本来はAPIリクエストなどが入る）
          showModal('successModal');
          downloadForm.reset();
        }
      });
    }
    
    // トレーナー登録フォームの処理
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // バリデーションチェック
        if (validateForm(this)) {
          // 成功時の処理（本来はAPIリクエストなどが入る）
          showModal('successModal');
          contactForm.reset();
        }
      });
    }
  
    // モーダルの初期化
    initializeModals();
  }
  
  /**
   * フォームバリデーション
   * @param {HTMLFormElement} form - バリデーションするフォーム要素
   * @return {boolean} バリデーション結果
   */
  function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // エラーメッセージをクリア
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
    
    // 必須項目のチェック
    requiredFields.forEach(field => {
      // チェックボックスの場合
      if (field.type === 'checkbox' && !field.checked) {
        isValid = false;
        showFieldError(field.parentNode, '同意が必要です');
        return;
      }
      
      // その他のフィールド
      if (!field.value.trim()) {
        isValid = false;
        showFieldError(field, '必須項目です');
      }
    });
    
    // メールアドレス形式のチェック
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value.trim())) {
        isValid = false;
        showFieldError(emailField, '有効なメールアドレスを入力してください');
      }
    }
    
    // 電話番号形式のチェック
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value.trim()) {
      const phoneRegex = /^[0-9-+\s]+$/;
      if (!phoneRegex.test(phoneField.value.trim())) {
        isValid = false;
        showFieldError(phoneField, '有効な電話番号を入力してください');
      }
    }
    
    return isValid;
  }
  
  /**
   * フィールドエラーの表示
   * @param {HTMLElement} field - エラーを表示するフィールド
   * @param {string} message - エラーメッセージ
   */
  function showFieldError(field, message) {
    // エラーメッセージ要素を作成
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // フィールドにエラークラスを追加
    field.classList.add('error');
    
    // エラーメッセージを追加
    if (field.parentNode) {
      field.parentNode.appendChild(errorElement);
    }
  }
  
  /**
   * モーダルの初期化
   */
  function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal__close, .modal__button');
    
    // 閉じるボタンのイベント
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
          hideModal(modal);
        }
      });
    });
    
    // モーダル外クリックで閉じる
    modals.forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          hideModal(this);
        }
      });
    });
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          hideModal(activeModal);
        }
      }
    });
  }
  
  /**
   * モーダルを表示
   * @param {string} modalId - 表示するモーダルのID
   */
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // モーダルを表示
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
  }
  
  /**
   * モーダルを非表示
   * @param {HTMLElement} modal - 非表示にするモーダル要素
   */
  function hideModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
  
  /**
   * ページ読み込み完了時の追加処理
   */
  window.addEventListener('load', function() {
    // 読み込み中表示を非表示
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.classList.add('preloader--hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  });