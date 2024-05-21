require('dotenv').config()
const { Bot, Keyboard, InlineKeyboard, GrammyError,HttpError  } = require('grammy')


const bot = new Bot(process.env.BOT_API_KEY)

bot.command('start', async (ctx) => {
    const startKeyboard = new Keyboard()
    .text('Вопрос 1')
    .text('Вопрос 2')
    .row()
    .text('Вопрос 3')
    .text('Вопрос 4')
    .resized()
    await ctx.reply('Привет! \nВот и пришло время квеста')
    await ctx.reply('С чего начнем? Выбери тему вопроса 👇', {
        reply_markup: startKeyboard
    })
})

bot.hears(["Вопрос 1", "Вопрос 2", "Вопрос 3", "Вопрос 4"], async (ctx) => {
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
      console.error("Ошибка запроса:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Кажется проблема на стороне Телеграма:", e);
    } else {
      console.error("Неизвестная ошибка:", e);
    } 
  });

bot.start()
