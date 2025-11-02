// تطبيق BookNotes Pro
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة التطبيق
    initApp();

    // عناصر DOM
    const app = document.getElementById('app');
    const loading = document.getElementById('loading');
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const searchBtn = document.getElementById('searchBtn');
    const searchBar = document.getElementById('searchBar');
    const closeSearch = document.getElementById('closeSearch');
    const pages = document.querySelectorAll('.page');
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    const addBookBtn = document.getElementById('addBookBtn');
    const addBookModal = document.getElementById('addBookModal');
    const saveBookBtn = document.getElementById('saveBookBtn');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const addNoteModal = document.getElementById('addNoteModal');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const readingModal = document.getElementById('readingModal');
    const translationModal = document.getElementById('translationModal');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const booksGrid = document.getElementById('booksGrid');
    const notesList = document.getElementById('notesList');

    // بيانات التطبيق
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentBook = null;
    let selectedText = '';

    // تهيئة التطبيق
    function initApp() {
        // تحميل البيانات
        loadBooks();
        loadNotes();
        updateStats();

        // إخفاء شاشة التحميل بعد 2 ثانية
        setTimeout(() => {
            loading.classList.add('hidden');
            app.classList.remove('hidden');
        }, 2000);

        // تحميل الإعدادات
        loadSettings();
    }

    // تحميل الكتب
    function loadBooks() {
        booksGrid.innerHTML = '';

        if (books.length === 0) {
            booksGrid.innerHTML = '<p>لا توجد كتب. أضف كتابك الأول!</p>';
            return;
        }

        books.forEach((book, index) => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <div class="book-cover">📖</div>
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
            `;
            bookCard.addEventListener('click', () => openBook(book, index));
            booksGrid.appendChild(bookCard);
        });
    }

    // تحميل الملاحظات
    function loadNotes() {
        notesList.innerHTML = '';

        if (notes.length === 0) {
            notesList.innerHTML = '<p>لا توجد ملاحظات. أضف ملاحظتك الأولى!</p>';
            return;
        }

        notes.forEach((note, index) => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            noteCard.innerHTML = `
                <div class="note-title">${note.title}</div>
                <div class="note-content">${note.content.substring(0, 100)}...</div>
            `;
            noteCard.addEventListener('click', () => editNote(index));
            notesList.appendChild(noteCard);
        });
    }

    // تحديث الإحصائيات
    function updateStats() {
        document.getElementById('total-books').textContent = books.length;
        document.getElementById('total-notes').textContent = notes.length;

        // حساب وقت القراءة (افتراضي)
        const readingTime = books.length * 2;
        document.getElementById('reading-time').textContent = readingTime;
    }

    // فتح كتاب للقراءة
    function openBook(book, index) {
        currentBook = { ...book, index };
        document.getElementById('readingTitle').textContent = book.title;
        document.getElementById('bookContentDisplay').textContent = book.content;
        readingModal.classList.remove('hidden');

        // إضافة إمكانية تحديد النص
        const bookContent = document.getElementById('bookContentDisplay');
        bookContent.addEventListener('mouseup', handleTextSelection);
    }

    // التعامل مع تحديد النص
    function handleTextSelection() {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            selectedText = selection.toString();
        }
    }

    // حفظ كتاب جديد
    saveBookBtn.addEventListener('click', function() {
        const title = document.getElementById('bookTitle').value;
        const author = document.getElementById('bookAuthor').value;
        const content = document.getElementById('bookContent').value;

        if (title && content) {
            const newBook = {
                id: Date.now(),
                title,
                author: author || 'مجهول',
                content,
                dateAdded: new Date().toLocaleDateString('ar-EG')
            };

            books.push(newBook);
            localStorage.setItem('books', JSON.stringify(books));
            loadBooks();
            updateStats();
            addBookModal.classList.add('hidden');
            resetBookForm();

            // عرض رسالة نجاح
            alert('تم إضافة الكتاب بنجاح!');
        } else {
            alert('يرجى إدخال عنوان ومحتوى للكتاب');
        }
    });

    // حفظ ملاحظة جديدة
    saveNoteBtn.addEventListener('click', function() {
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;

        if (title && content) {
            const newNote = {
                id: Date.now(),
                title,
                content,
                dateAdded: new Date().toLocaleDateString('ar-EG')
            };

            notes.push(newNote);
            localStorage.setItem('notes', JSON.stringify(notes));
            loadNotes();
            updateStats();
            addNoteModal.classList.add('hidden');
            resetNoteForm();

            // عرض رسالة نجاح
            alert('تم إضافة الملاحظة بنجاح!');
        } else {
            alert('يرجى إدخال عنوان ومحتوى للملاحظة');
        }
    });

    // إعادة تعيين نموذج الكتاب
    function resetBookForm() {
        document.getElementById('bookTitle').value = '';
        document.getElementById('bookAuthor').value = '';
        document.getElementById('bookContent').value = '';
    }

    // إعادة تعيين نموذج الملاحظة
    function resetNoteForm() {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
    }

    // تحميل الإعدادات
    function loadSettings() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        const fontSize = localStorage.getItem('fontSize') || 'medium';

        document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
        darkModeToggle.checked = darkMode;
        document.getElementById('fontSize').value = fontSize;
        applyFontSize(fontSize);
    }

    // تطبيق حجم الخط
    function applyFontSize(size) {
        const sizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        document.body.style.fontSize = sizes[size];
    }

    // أحداث الواجهة
    menuBtn.addEventListener('click', function() {
        sidebar.classList.add('active');
    });

    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });

    searchBtn.addEventListener('click', function() {
        searchBar.classList.remove('hidden');
    });

    closeSearch.addEventListener('click', function() {
        searchBar.classList.add('hidden');
    });

    // التنقل بين الصفحات
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page') + '-page';

            pages.forEach(page => {
                page.classList.remove('active');
            });

            document.getElementById(pageId).classList.add('active');
            sidebar.classList.remove('active');
        });
    });

    // فتح نافذة إضافة كتاب
    addBookBtn.addEventListener('click', function() {
        addBookModal.classList.remove('hidden');
    });

    // فتح نافذة إضافة ملاحظة
    addNoteBtn.addEventListener('click', function() {
        addNoteModal.classList.remove('hidden');
    });

    // إغلاق النوافذ المنبثقة
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
        });
    });

    // النقر خارج النافذة المنبثقة يغلقها
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });

    // تبديل الوضع الليلي
    darkModeToggle.addEventListener('change', function() {
        const isDarkMode = this.checked;
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', isDarkMode);
    });

    // تغيير حجم الخط
    document.getElementById('fontSize').addEventListener('change', function() {
        const size = this.value;
        applyFontSize(size);
        localStorage.setItem('fontSize', size);
    });

    // زر الترجمة
    document.getElementById('translateBtn').addEventListener('click', function() {
        if (selectedText) {
            document.getElementById('originalText').textContent = selectedText;
            document.getElementById('translatedText').textContent = 'جاري الترجمة...';
            translationModal.classList.remove('hidden');

            // محاكاة الترجمة (في التطبيق الحقيقي، استخدم API ترجمة)
            setTimeout(() => {
                document.getElementById('translatedText').textContent = `[النص المترجم: ${selectedText}] - هذه ترجمة محاكاة`;
            }, 1000);
        } else {
            alert('يرجى تحديد نص لترجمته أولاً');
        }
    });

    // زر نسخ النص
    document.getElementById('copyTextBtn').addEventListener('click', function() {
        if (selectedText) {
            navigator.clipboard.writeText(selectedText)
                .then(() => alert('تم نسخ النص إلى الحافظة'))
                .catch(err => alert('خطأ في نسخ النص: ' + err));
        } else {
            alert('يرجى تحديد نص لنسخه أولاً');
        }
    });

    // زر الإضافة للمفضلة
    document.getElementById('addToFavoritesBtn').addEventListener('click', function() {
        if (selectedText) {
            const favoriteNote = {
                id: Date.now(),
                title: `مقطع من: ${currentBook.title}`,
                content: selectedText,
                dateAdded: new Date().toLocaleDateString('ar-EG'),
                type: 'favorite'
            };

            notes.push(favoriteNote);
            localStorage.setItem('notes', JSON.stringify(notes));
            alert('تم إضافة المقطع إلى المفضلة');
        } else {
            alert('يرجى تحديد نص لإضافته إلى المفضلة');
        }
    });

    // إضافة بعض الكتب الافتراضية للتجربة
    if (books.length === 0) {
        const defaultBooks = [
            {
                id: 1,
                title: 'رواية البؤساء',
                author: 'فيكتور هوغو',
                content: 'كان جان فالجان رجلاً طيباً، لكن الظروف القاسية دفعته لارتكاب جريمة سرقة بسيطة، فحكم عليه بالسجن خمس سنوات. حاول الهرب عدة مرات، فزادت مدة سجنه إلى تسعة عشر عاماً. عندما أطلق سراحه، كان رجلاً مكسوراً، لا يجد من يمد له يد العون. ذهب إلى بيت الأسقف، الذي استقبله بحفاوة، وأعطاه مأوى وطعاماً. لكن جان فالجان سرق فضة الأسقف وهرب. أمسك به الدرك وأعادوه إلى بيت الأسقف. لكن الأسقف قال للدرك إنه هو الذي أعطى الفضّة لجان فالجان، بل وأعطاه شمعدانين فضيين أيضاً. هذه اللحظة غيرت حياة جان فالجان للأبد.',
                dateAdded: '2023-10-15'
            },
            {
                id: 2,
                title: 'الأيام',
                author: 'طه حسين',
                content: 'كان طفلاً صغيراً يحب اللعب والمرح، لكن القدر كان يخبئ له مفاجأة قاسية. في إحدى الأيام، بينما كان يلعب مع أقرانه، أصيب في عينيه بمرض خطير. حاول والديه علاجه بكل الطرق، لكن دون جدوى. فقد الطفل بصره، وأصبح يعيش في عالم من الظلام. لكن هذا لم يمنعه من متابعة تعليمه. كان يذهب إلى الكتّاب، ويحفظ القرآن، ثم انتقل إلى الأزهر ليكمل دراسته. كان يواجه صعوبات كبيرة، لكن إصراره وعزيمته ساعداه على التغلب عليها. أصبح طه حسين أحد أعظم الأدباء في تاريخ الأدب العربي.',
                dateAdded: '2023-11-20'
            }
        ];

        books = defaultBooks;
        localStorage.setItem('books', JSON.stringify(books));
        loadBooks();
    }
});
