

window.addEventListener('load', function() {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
  
    // Устанавливаем отступ для основного контента
    function adjustMainMargin() {
      const headerHeight = header.offsetHeight;
      main.style.marginTop = `${headerHeight}px`;
    }
  
    // Настроить отступ при загрузке страницы
    adjustMainMargin();
  
    // Обновить отступ при изменении размера окна
    window.addEventListener('resize', adjustMainMargin);
  });
document.addEventListener("DOMContentLoaded", () => {
    // Авторизация
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch('/login', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(error.message);
                    return;
                }

                const result = await response.json();
                alert(result.message);
                window.location.href = "/";
            } catch (error) {
                console.error("Ошибка авторизации:", error);
            }
        });
    }

    // Регистрация
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(error.message);
                    return;
                }

                const result = await response.json();
                alert(result.message);
                window.location.href = "/login";
            } catch (error) {
                console.error("Ошибка регистрации:", error);
            }
        });
    }

    // Обратная связь
    const feedbackForm = document.getElementById("feedback-form");
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            try {
                const response = await fetch("/feedback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, message }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(error.message);
                    return;
                }

                const result = await response.json();
                alert(result.message);
            } catch (error) {
                console.error("Ошибка отправки обратной связи:", error);
            }
        });
    }

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            const response = await fetch("/logout");
            window.location.href = "/";
        });
    }
    const contentContainer = document.getElementById('standerd-info');
    const statLink = document.getElementById('stat-link');
    const infoLink = document.getElementById('info-link');
    const opinionLink = document.getElementById('opinion-link');
    const legalEntitySelect = document.getElementById('legal-entity-select');
    const statChangesContainer = document.getElementById('stat-changes-container');
    const filterContainer = document.getElementById('filter-container');
    const categoriesS = {
        "Крайне выгодные": document.getElementById('extremely-profitable'),
        "Выгодные": document.getElementById('profitable'),
        "Невыгодные": document.getElementById('unprofitable'),
        "Крайне невыгодные": document.getElementById('extremely-unprofitable')
    };



    const filtersContainer = document.createElement('div');
    filtersContainer.id = 'filters-container';

    const createSelectFilter = (id, label, options) => {
        const container = document.createElement('div');
        container.className = 'filter-item';

        const selectLabel = document.createElement('label');
        selectLabel.textContent = label;
        selectLabel.setAttribute('for', id);

        const select = document.createElement('select');
        select.id = id;
        select.innerHTML = `<option value="">Все</option>`;
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });

        container.appendChild(selectLabel);
        container.appendChild(select);
        return container;
    };

    const sortState = {
        discount: 'none', // 0 - не сортировано, 1 - по возрастанию, 2 - по убыванию
        quality: 'none', // 0 - не сортировано, 1 - по возрастанию, 2 - по убыванию
    };

    // Функция для сортировки данных
    const sortData = (data, columnIndex, state) => {
        return data.sort((a, b) => {
            let valA = a[columnIndex];
            let valB = b[columnIndex];

            if (state === 'asc') {
                return valA > valB ? 1 : -1;
            } else if (state === 'desc') {
                return valA < valB ? 1 : -1;
            }
            return 0;
        });
    };
    // Функция для генерации таблицы
    const generateTable = (data) => {
        const table = document.createElement('table');
        table.className = 'discount-table';

        // Заголовок таблицы
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ЮР лицо</th>
                <th>Тип товара</th>
                <th>Категория держателей карт</th>
                <th>
                    Средний размер скидки в %
                    <span class="sort-arrow" id="discount-sort">↕</span>
                </th>
                <th>
                    Среднее качество товара
                    <span class="sort-arrow" id="quality-sort">↕</span>
                </th>
            </tr>
        `;
        table.appendChild(thead);

        // Тело таблицы
        const tbody = document.createElement('tbody');
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><a href="https://yandex.ru/search/?text=${item[0]}" target="_blank">${item[0]}</a></td>
                <td>${item[1]}</td>
                <td>${item[2]}</td>
                <td>${item[3]}</td>
                <td>${item[4] === null ? "..." : item[4]}</td>
                <td>
                <button class="opinion-button" data-legal-entity="${item[0]}">
                    📝
                </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        return table;
    };

    // Добавление обработчика на кнопки для оставления мнения
    document.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('opinion-button')) {
            const legalEntity = event.target.getAttribute('data-legal-entity');
            // Переход на форму с передачей данных
            window.location.href = `/leave_opinion?legal_entity=${legalEntity}`;
        }
    });

    const applyFilters = (data) => {
        const selectedLegalEntity = document.getElementById('legal-entity-filter').value;
        const selectedCategory = document.getElementById('category-filter').value;
        const selectedHolder = document.getElementById('holder-filter').value;

        return data.filter(item => {
            const matchesLegalEntity = !selectedLegalEntity || item[0] === selectedLegalEntity;
            const matchesCategory = !selectedCategory || item[1].includes(selectedCategory);
            const matchesHolder = !selectedHolder || item[2].includes(selectedHolder);
            return matchesLegalEntity && matchesCategory && matchesHolder;
        });
    };

    // Функция для показа и скрытия элементов
    const toggleVisibility = (showStatChanges = false) => {
        if (showStatChanges) {
            statChangesContainer.style.display = 'flex';
            filterContainer.style.display = 'block';
        } else {
            statChangesContainer.style.display = 'none';
            filterContainer.style.display = 'none';
        }
    };

    // Изначально скрываем секции категорий и селектор
    toggleVisibility(false);

    // Функция для загрузки данных по теме
    const loadData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
            const data = await response.json();

            // Очистка контента перед отображением новых данных
            contentContainer.innerHTML = '';

            // Если данные относятся к статистике, отображаем категории и селектор
            if (url === '/get_stat_changes' && data.grouped ) {
                toggleVisibility(true);

                // Заполняем селектор юридических лиц
                legalEntitySelect.innerHTML = `<option value="">Любые товары</option>`;
                // const uniqueCategories = [...new Set(Object.values(data.categories))];
                data.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    legalEntitySelect.appendChild(option);
                });

                const displayData = (selectedCategory = '') => {
                    // Очищаем все колонки
                    Object.values(categoriesS).forEach(column => column.innerHTML = '');
            
                    // Отображаем предприятия по категориям
                    Object.entries(data.grouped).forEach(([groupName, enterprises]) => {
                        // Создаем группу для каждой категории
                        const groupColumn = categoriesS[groupName]; 
                        if (groupColumn) {
                            enterprises.forEach(enterprise => {
                                if (selectedCategory === '' || enterprise.Categories.includes(selectedCategory)) {

                                const li = document.createElement('li');
                                li.innerHTML = `<a href="https://yandex.ru/search/?text=${enterprise.LegalEntity}" target="_blank">${enterprise.LegalEntity}</a>`;
                                groupColumn.appendChild(li);
            
                                // Выводим категории товаров для каждого ЮР лица (не отображаются пользователю)
                                    // const categories = document.createElement('ul');
                                    // enterprise.Categories.split(',').forEach(category => {
                                    //     const categoryItem = document.createElement('li');
                                    //     categoryItem.textContent = category; // Категории товаров
                                    //     categories.appendChild(categoryItem);
                                    // });
                                    // li.appendChild(categories);
                                }
                            });
                        }
                    });
                }

                displayData();

                legalEntitySelect.addEventListener('change', (e) => {
                    const selectedCategory = e.target.value;
                    displayData(selectedCategory);
                });
            } else {
                // Скрываем категории и селектор для других тем
                toggleVisibility(false);

                if (url === '/get_discount_info') {
                    // Получаем уникальные значения для фильтров
                    const legalEntities = [...new Set(data.map(item => item[0]))];
                    const categories = [...new Set(data.map(item => item[1]))];
                    const holders = [...new Set(data.map(item => item[2]))];

                    // Создаем фильтры
                    filtersContainer.innerHTML = '';
                    filtersContainer.appendChild(createSelectFilter('legal-entity-filter', 'ЮР лицо:', legalEntities));
                    filtersContainer.appendChild(createSelectFilter('category-filter', 'Тип товара:', categories));
                    filtersContainer.appendChild(createSelectFilter('holder-filter', 'Категория держателей карты:', holders));
                    contentContainer.appendChild(filtersContainer);

                    // Генерация таблицы
                    const renderTable = () => {
                        const filteredData = applyFilters(data);
                        const table = generateTable(filteredData);
                        const existingTable = document.querySelector('.discount-table');
                        if (existingTable) existingTable.remove();
                        contentContainer.appendChild(table);
                    };

                    renderTable();

                    // Обновление таблицы при изменении фильтров
                    filtersContainer.querySelectorAll('select').forEach(select => {
                        select.addEventListener('change', renderTable);
                    });



                    const discountSortArrow = document.getElementById("discount-sort");
                    const qualitySortArrow = document.getElementById("quality-sort");
                    const handleSortClick = (column, index) => {
                        if (sortState[column] === 'asc') {
                            sortState[column] = 'desc';
                        } else if (sortState[column] === 'desc') {
                            sortState[column] = 'none';
                        } else {
                            sortState[column] = 'asc';
                        }                        
                        // Сортировка данных и обновление таблицы
                        const sortedData = sortData(data, index, sortState[column]);
                        const table = generateTable(sortedData);
                        const existingTable = document.querySelector('.discount-table');
                        if (existingTable) existingTable.remove();
                        contentContainer.appendChild(table);
                    };

                    // Обработчики кликов по стрелочкам сортировки
                    discountSortArrow.addEventListener('click', () => handleSortClick('discount', 3));  // Индекс для "Средний размер скидки"
                    qualitySortArrow.addEventListener('click', () => handleSortClick('quality', 4));
                    
                }
               
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    // Обработчики кликов по ссылкам
    statLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadData('/get_stat_changes');
    });

    infoLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadData('/get_discount_info');
    });

    // opinionLink.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     loadData('/get_public_opinion');
    // });
});
    

// Обработчики кликов для сортировки
                    // const sortableHeaders = document.querySelectorAll('span.sort-arrow');
                    // sortableHeaders.forEach(header => {
                    //     header.addEventListener('click', () => {
                    //         const column = header.getAttribute('sort-arrow');
                    //         sortState[column] = sortState[column] === 'asc' ? 'desc' : (sortState[column] === 'desc' ? 'none' : 'asc');

                    //         // Сортировка и перерисовка таблицы
                    //         const sortedData = sortData(data, column, sortState[column]);
                    //         const table = generateTable(sortedData);
                    //         const existingTable = document.querySelector('.discount-table');
                    //         if (existingTable) existingTable.remove();
                    //         contentContainer.appendChild(table);
                    //     });
                    // });