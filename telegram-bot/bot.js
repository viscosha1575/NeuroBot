const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const express = require('express');

const TOKEN = process.env.TOKEN;
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();

const webAppUrl = 'https://eggsgame-6b328.web.app/';

// Маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Бот работает!');
});

// Обработчик команды /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, `Привет, ${msg.from.first_name}! Я твой Telegram-бот.`);

    // Отправляем сообщение с inline-кнопкой для открытия мини-приложения
    await bot.sendMessage(chatId, 'Начните игру', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Открыть игру',
                        web_app: { url: webAppUrl, request_full_screen: true },
                    },
                ],
            ],
        },
    });
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "Я могу отвечать на сообщения. Просто напиши мне что-нибудь!");
});

// Ответ на обычные сообщения
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text.startsWith('/')) {
        bot.sendMessage(chatId, `Ты сказал: ${msg.text}`);
    }
});

// Запуск Express-сервера (нужен для Render)
app.listen(PORT, () => {
    console.log(`Бот запущен на порту ${PORT}`);
});

