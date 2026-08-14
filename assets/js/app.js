document.addEventListener('DOMContentLoaded', () => {
    // 1. Reading Progress Bar & ScrollSpy
    const progressBar = document.querySelector('.progress-bar');
    const sections = document.querySelectorAll('.guide-section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0 && progressBar) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active');
            }
        });
    });

    // 2. Theme Toggle (Dark/Light)
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('win11_guide_theme') || 'dark';

    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('win11_guide_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        if (theme === 'light') {
            themeToggleBtn.innerHTML = '🌙';
            themeToggleBtn.setAttribute('title', 'Cambiar a modo oscuro');
        } else {
            themeToggleBtn.innerHTML = '☀️';
            themeToggleBtn.setAttribute('title', 'Cambiar a modo claro');
        }
    }

    // 3. Image Lightbox Modal
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalClose = document.getElementById('modalClose');
    const zoomableWrappers = document.querySelectorAll('.screenshot-wrapper');

    zoomableWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const img = wrapper.querySelector('img');
            if (img && modal && modalImg) {
                modalImg.src = img.src;
                modalImg.alt = img.alt || 'Captura de pantalla ampliada';
                modal.classList.add('active');
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // 4. Interactive Checklist with LocalStorage
    const checklistItems = document.querySelectorAll('.checklist-item');
    const checklistCounter = document.getElementById('checklistCounter');

    function updateChecklistProgress() {
        const total = checklistItems.length;
        let checkedCount = 0;
        
        checklistItems.forEach((item, index) => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                checkedCount++;
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
            localStorage.setItem(`win11_check_${index}`, checkbox.checked ? '1' : '0');
        });

        if (checklistCounter) {
            checklistCounter.textContent = `${checkedCount} de ${total} listos`;
            if (checkedCount === total) {
                checklistCounter.style.background = 'rgba(16, 185, 129, 0.3)';
                checklistCounter.style.color = '#34d399';
            } else {
                checklistCounter.style.background = 'rgba(0, 120, 212, 0.2)';
                checklistCounter.style.color = '#38bdf8';
            }
        }
    }

    checklistItems.forEach((item, index) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const isSavedChecked = localStorage.getItem(`win11_check_${index}`) === '1';
        if (checkbox) {
            checkbox.checked = isSavedChecked;
        }

        item.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            updateChecklistProgress();
        });
    });

    updateChecklistProgress();

    // 5. Copy to Clipboard Utility
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetText = btn.getAttribute('data-copy');
            if (targetText) {
                navigator.clipboard.writeText(targetText).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = '¡Copiado!';
                    btn.style.background = '#10b981';
                    btn.style.color = '#ffffff';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.style.color = '';
                    }, 2000);
                });
            }
        });
    });

    // 6. Accordion FAQs
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');

            // Close other open accordions if desired (optional)
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) otherContent.style.maxHeight = null;
                }
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                item.classList.remove('active');
                content.style.maxHeight = null;
            }
        });
    });

    // 7. Brand Filter for Boot Keys Table
    const brandSearchInput = document.getElementById('brandSearchInput');
    const tableRows = document.querySelectorAll('#bootKeysTable tbody tr');

    if (brandSearchInput) {
        brandSearchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            tableRows.forEach(row => {
                const brand = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
                if (brand.includes(term)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});
