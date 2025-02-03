document.addEventListener('DOMContentLoaded', () => {
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const targetUrl = 'http://shift-intensive.ru/api/pizza/catalog';
  


    
    // Запрос на получение каталога пицц
    fetch(proxyUrl + encodeURIComponent(targetUrl))
        .then(response => response.json())
        .then(data => {
            console.log("Полученные данные:", data); // Проверяем структуру данных

            const container = document.querySelector('.footer__container');

            if (!data.catalog || !Array.isArray(data.catalog)) {
                console.error('Некорректный формат данных:', data);
                container.innerHTML = "<p>Ошибка загрузки данных</p>";
                return;
            }

            // Создаем карточки пицц
            data.catalog.forEach(pizza => {
                const pizzaCard = document.createElement('div');
                pizzaCard.classList.add('pizza-card');

                const pizzaImage = pizza.img ? `http://shift-intensive.ru/api${pizza.img}` : 'default-image.png';
                const pizzaPrice = pizza.sizes && pizza.sizes.length > 0 ? pizza.sizes[0].price : 'Не указана';

                pizzaCard.innerHTML = `
                    <img class="card-img" src="${pizzaImage}" alt="${pizza.name}">
                    <div class="card-title">${pizza.name}</div>
                    <div class="card-sub">${pizza.description}</div>
                    <div class="card-footer">
                        <div class="card-price">от ${pizzaPrice} ₽</div>
                        <button class="button">Выбрать</button>
                    </div>
                `;

                // Добавляем обработчик на кнопку "Выбрать"
                const selectButton = pizzaCard.querySelector('.button');
                selectButton.addEventListener('click', () => {
                    loadToppings(pizza);
                });

                container.appendChild(pizzaCard);
            });
        })
        .catch(error => {
            console.error('Ошибка сети:', error);
            document.querySelector('.footer__container').innerHTML = "<p>Ошибка загрузки данных</p>";
        });
});

// Функция для загрузки топпингов и открытия попапа
function loadToppings(pizza) {
    // Берем топпинги из переданных данных пиццы
    const toppings = pizza.toppings || [];  // Топпинги для выбранной пиццы

    // Открываем попап с пиццей и топпингами
    openPopup(pizza, toppings);
}

// Функция для открытия попапа с данными пиццы, топпингами и выбором размера
function openPopup(pizza, toppings) {
    const popup = document.createElement('div');
    popup.classList.add('popup');

    // Составляем HTML для выбора размера пиццы с кнопками
    const sizeButtons = pizza.sizes.map(size => {
        return `
            <button class="size-button" data-price="${size.price}" data-size="${size.name}">${size.name}</button>
        `;
    }).join('');

    // Создаем HTML для отображения топпингов с изображениями и ценами
    const toppingsHtml = toppings.map(topping => `
        <div class="topping-card">
            <input type="checkbox" value="${topping.name}" data-price="${topping.cost}" data-name="${topping.name}">
            <div class="topping-info">
                <img class="topping-img" src="http://shift-intensive.ru/api${topping.img}" alt="${topping.name}">
                <span class="topping-name">${topping.name} (+${topping.cost} ₽)</span>
            </div>
        </div>
    `).join('');

    popup.innerHTML = `
        <div class="popup-content">
            <span class="popup-close">X</span>
            <div class="popup-container">
                <div class="popup-left">
                    <img class="popup-img" src="http://shift-intensive.ru/api${pizza.img}" alt="${pizza.name}">
                </div>
                <div class="popup-right">
                    <h2>${pizza.name}</h2>
                    <p><strong>Описание:</strong> ${pizza.description}</p>
                    <h3>Выберите размер</h3>
                    <div class="size-buttons-container">
                        ${sizeButtons}
                    </div>
                   
                    <h3>Добавить по вкусу</h3>
                    <div class="toppings-container">
                        ${toppingsHtml}
                    </div>
                     <p><strong>Цена:</strong> <span id="popup-price">${pizza.sizes[0].price} ₽</span></p>
                    <button class="popup-buy-button">Добавить в корзину</button>

                </div>
            </div>
        </div>
    `;

    // Изначальная цена пиццы
    let totalPrice = parseInt(pizza.sizes[0].price);

    // Обновляем итоговую цену при выборе размера
    const sizeButtonsContainer = popup.querySelector('.size-buttons-container');
    const priceSpan = popup.querySelector('#popup-price');

    sizeButtonsContainer.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('size-button')) {
            // Обновляем цену в зависимости от выбранной кнопки
            const sizePrice = parseInt(e.target.getAttribute('data-price'));
            totalPrice = sizePrice;
            priceSpan.textContent = `${totalPrice} ₽`;

            // Пересчитываем цену с учетом выбранных топпингов
            updatePrice();
        }
    });

    // Обновляем цену с учетом выбранных топпингов
    const toppingsContainer = popup.querySelector('.toppings-container');
    toppingsContainer.addEventListener('change', () => {
        updatePrice();
    });

    function updatePrice() {
        let toppingsPrice = 0;
        // Суммируем стоимость выбранных топпингов
        popup.querySelectorAll('.topping-card input:checked').forEach(input => {
            toppingsPrice += parseInt(input.getAttribute('data-price'));
        });

        // Обновляем итоговую цену
        priceSpan.textContent = `${totalPrice + toppingsPrice} ₽`;
    }

    document.body.appendChild(popup);

    // Закрытие попапа
    const closeButton = popup.querySelector('.popup-close');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });

    // Закрытие при клике вне попапа
    window.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
        }
    });
}
