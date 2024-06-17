require('dotenv').config()
const { Bot, Keyboard, InlineKeyboard, GrammyError,HttpError  } = require('grammy')


const bot = new Bot(process.env.BOT_API_KEY)

bot.command('start', async (ctx) => {
    const startKeyboard = new Keyboard() 
    await ctx.reply('Привет! \nВот и пришло время приключений!')
    await ctx.reply('👇Скорей нажимай меню и начинай квест')
})

bot.command('about', async (ctx) => {
  await ctx.reply('Новое приключение о компании в рамках корпоратива')
})

bot.command('quest', async (ctx) => {
  const questKeyboard = new Keyboard()
  .text('Получить вопрос')
  .text('Статус заданий')
  .row()
  .text('Баланс')
  .text('Обратиться в поддержку', 'support')
  .resized()
  await ctx.reply('Скорей начинай наш квест, чтобы заработать баллы', {
    reply_markup: questKeyboard
})
})
const backKeyboard = new InlineKeyboard().text('< Назад в меню', 'back');
bot.hears('Обратиться в поддержку', async (ctx) => {
  await ctx.reply('Напишите Ваш вопрос', { reply_markup: backKeyboard,
  });
})

bot.hears(["Получить вопрос"], async (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
    .text("Получить ответ", JSON.stringify({
        type: ctx.message.text,
        questionId: 1
    }))
    .text("Отмена", "cancel")
    await ctx.reply(`Что такое ${ctx.message.text}`, {
        reply_markup: inlineKeyboard
    })
})

bot.api.setMyCommands([
  {command: 'start', description: 'Запуск бота'}, 
  {command: 'about', description: 'Что тут происходит?'}, 
  {command: 'quest', description: 'Квест'} 
])

bot.on('callback_query:data', async (ctx) => {
    if (ctx.callbackQuery.data === 'cancel') {
        await ctx.reply("Отменено")
        await ctx.answerCallbackQuery()
        return
    }
    const callbackData = JSON.parse(ctx.callbackQuery.data)
    await ctx.reply(`${callbackData.type} - в нашем квесте`)
    await ctx.answerCallbackQuery()
})






bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Ошибка обработки ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Ошибка запроса: ", e.description);
    } else if (e instanceof HttpError) {
      console.error("Кажется проблема на стороне Телеграма: ", e);
    } else {
      console.error("Неизвестная ошибка: ", e);
    } 
  });

bot.start()
