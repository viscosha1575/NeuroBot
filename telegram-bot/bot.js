const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const express = require('express');

const TOKEN = process.env.TOKEN;
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();

const webAppUrl = 'https://eggsgame-6b328.web.app/';

// Удаляем Webhook перед запуском polling
async function resetWebhookAndStart() {
    try {
        await bot.deleteWebhook();
        console.log('Webhook удалён. Запускаем polling...');
    } catch (error) {
        console.error('Ошибка при удалении Webhook:', error);
    }
}

// Запуск бота после удаления Webhook
resetWebhookAndStart().then(() => {
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

    console.log('Бот запущен в режиме polling');
});

// Express-сервер для Render
app.get('/', (req, res) => {
    res.send('Бот работает!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
