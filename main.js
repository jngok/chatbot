// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 로딩 오버레이 제거
    setTimeout(function() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(function() {
                loadingOverlay.style.display = 'none';
            }, 500);
        }
    }, 3000);

    // 스크롤 이벤트
    setupScrollEvents();
    
    // 부드러운 스크롤
    setupSmoothScroll();
});

// 스크롤 이벤트 설정
function setupScrollEvents() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // 헤더 배경 변경
        const header = document.querySelector('.header');
        if (scrolled > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        
        // 백투탑 버튼
        const backToTop = document.getElementById('back-to-top');
        if (scrolled > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
}

// 부드러운 스크롤 설정
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 빠른 질문 버튼 클릭 처리
function askQuestion(button) {
    const question = button.getAttribute('data-question');
    
    // 시각적 피드백
    button.style.background = '#2563eb';
    button.style.color = 'white';
    button.style.transform = 'scale(0.95)';
    
    setTimeout(function() {
        button.style.background = '';
        button.style.color = '';
        button.style.transform = '';
    }, 200);
    
    // Gradio 앱에 질문 전달 시도
    setTimeout(function() {
        try {
            // Gradio 텍스트 입력 필드 찾기
            const gradioFrame = document.querySelector('gradio-app');
            if (gradioFrame) {
                // Shadow DOM 접근 시도
                const textInputs = gradioFrame.querySelectorAll('input[type="text"], textarea');
                if (textInputs.length > 0) {
                    const lastInput = textInputs[textInputs.length - 1];
                    lastInput.value = question;
                    lastInput.focus();
                    
                    // 입력 이벤트 트리거
                    const event = new Event('input', { bubbles: true });
                    lastInput.dispatchEvent(event);
                }
            }
        } catch (error) {
            console.log('Gradio 입력 필드 접근 시도 중...');
        }
    }, 1000);
    
    // 챗봇 영역으로 스크롤
    const chatbotSection = document.getElementById('chatbot');
    if (chatbotSection) {
        chatbotSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 백투탑 버튼
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Gradio 앱 로드 상태 체크
function checkGradioLoad() {
    const gradioApp = document.querySelector('gradio-app');
    if (gradioApp) {
        // Gradio 앱이 완전히 로드되면 로딩 오버레이 제거
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const loadingOverlay = document.getElementById('loading-overlay');
                    if (loadingOverlay && gradioApp.children.length > 0) {
                        loadingOverlay.style.display = 'none';
                        observer.disconnect();
                    }
                }
            });
        });
        
        observer.observe(gradioApp, {
            childList: true,
            subtree: true
        });
    }
}

// 페이지 성능 최적화
window.addEventListener('load', function() {
    checkGradioLoad();
    
    // 이미지 지연 로딩 (필요시)
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// 에러 처리
window.addEventListener('error', function(e) {
    console.log('페이지 로드 중 에러:', e.message);
});