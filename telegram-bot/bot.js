const TelegramBot = require('node-telegram-bot-api');

// Замените 'YOUR_BOT_TOKEN' на ваш реальный токен бота
const TOKEN = '7160696346:AAG_YupJCXOkPJzFDtex-U53GntCb6IwmtI';
const bot = new TelegramBot(TOKEN, { polling: true });
const webAppUrl = 'https://eggsgame-6b328.web.app/'

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
                        text: 'Открыть игру', // Текст кнопки
                        web_app: { url: webAppUrl, request_full_screen: true }, // Ссылка на мини-приложение
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

console.log('Бот запущен...');

