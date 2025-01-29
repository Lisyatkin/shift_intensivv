document.addEventListener('DOMContentLoaded', () => {
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const targetUrl = 'http://shift-intensive.ru/api/pizza/catalog';

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

            data.catalog.forEach(pizza => {
                const pizzaCard = document.createElement('div');
                pizzaCard.classList.add('pizza-card');

                // Проверяем, есть ли изображение
                const pizzaImage = pizza.img ? `http://shift-intensive.ru/api${pizza.img}` : 'default-image.png';

                // Проверяем, есть ли цены
                const pizzaPrice = (pizza.sizes && pizza.sizes.length > 0) ? pizza.sizes[0].price : 'Не указана';

                // Добавляем HTML карточки
                pizzaCard.innerHTML = `
                    <img class="card-img" src="${pizzaImage}" alt="${pizza.name}">
                    <div class="card-title">${pizza.name}</div>
                    <div class="card-sub">${pizza.description}</div>
                    <div class="card-footer">
                        <div class="card-price">от ${pizzaPrice} ₽</div>
                        <button class="button">Выбрать</button>
                    </div>
                `;

                container.appendChild(pizzaCard);
            });
        })
        .catch(error => {
            console.error('Ошибка сети:', error);
            document.querySelector('.footer__container').innerHTML = "<p>Ошибка загрузки данных</p>";
        });
});
