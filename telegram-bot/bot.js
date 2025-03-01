const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const express = require('express');

const TOKEN = process.env.TOKEN;
const PORT = process.env.PORT || 3000;
const DOMAIN = 'https://neurobot.onrender.com'; // Замените на ваш домен
const WEBHOOK_URL = `${DOMAIN}/bot${TOKEN}`;

const bot = new TelegramBot(TOKEN, { webHook: true });
const app = express();

const webAppUrl = 'https://eggsgame-6b328.web.app/';

// Устанавливаем Webhook
bot.setWebHook(WEBHOOK_URL)
    .then(() => console.log(`Webhook успешно установлен: ${WEBHOOK_URL}`))
    .catch(err => console.error('Ошибка при установке Webhook:', err));

// Обрабатываем входящие запросы от Telegram
app.use(express.json());
app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Обработчики команд
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, `Привет, ${msg.from.first_name}! Я твой Telegram-бот.`);

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

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text.startsWith('/')) {
        bot.sendMessage(chatId, `Ты сказал: ${msg.text}`);
    }
});

// Express-сервер для проверки работы бота
app.get('/', (req, res) => {
    res.send('Бот работает через Webhook!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
