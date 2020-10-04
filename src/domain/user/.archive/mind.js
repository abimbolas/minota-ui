export class Mind {}

// let note = new String('"Для себя" - это такая же абстракция, неизвестное постороннее.')
//
// note = {
//   date: {
//     self: '25 sep 1979',
//     other: [`all dates with links to notes at these dates? all date groups/structs, like sessions in time? grouped recents ('last year', 'last session', etc.). Or they all also group into date? Or this grouping should be according to same logic - extend existing with... what? Variable extending - that's tricky`]
//   },
//   text: ''
// };
//
// note = {
//   date: {
//     self: '25 sep 1979',
//     other: []
//   }
// };
//
// note = {
//   date: {
//     self: '25 sep 1979', // self.year, self.month, self
//     get other () {
//       return Object.assign([], {
//         asDates: [],
//         asMonths: [],
//         asYears: [],
//         asMoments: [],
//         asSessions: [],
//         asUsual: []
//       })
//     }
//   }
// }

/*
Второе - как переключить "текущий" self? Текущий вариант other.as

Третье - преобразование примитива (строка даты) в сложный объект, деленный на элементы.

Пути:
1. имеем один элемент
2. где его другое?
Ответ: его другое зависит от определённости, на которую мы смотрим

Имеем один элемент, имеем одну его определённость.
Она усложняется и дробится на части - как это реализовать? Например имеем точку - дату. Но она дробится на день, месяц, год, а также неведомо - сессия, периоды. Как имея исходную точку - дату - контролируемо перейти в точку где дата уже сложная категория. И назад - упростить сложную категорию до простоты.

Есть парсеры примитивов. Как узнать что данная дата это месяц или период? Нужны парсеры примитивов, которые скажут. Тогда сессия или период - это кастомный парсер. Что такое парсер? Это собственно свойство "asPeriod", "asSession", "asYear" - которые неведомым образов выдерут из примитива определённость, смысл.

Выдирание смысла, создание смысла из ничего, из примитива - это отлично! Ведь так и происходит.

Что дальше? Думаю пока работать с объектами. Начать с заметки, как единицы смысла (текст), а дальше её разворачивать в сложный мир мышления. И этот путь должен и быть запрограммирован в сервисе - его стадии и движение по нему вперед-назад.

Заметка это объект? Или акт? Заметка сначала появляется в результате акта.

note('something')

new Note('something')

to note

Учесть что акт (функция) это тоже уже объект, но более сложный. Можно использовать это.

Заметка появляется в результате акта.

note('something') === [note]

акт и результат акта - разные вещи? Да. Значит акт создания заметки и сама заметка, созданная этим актом могут быть разными сущностями. Акт создания заметки не обязательно конструктор класса, более того, его бытие как конструктора класса пожалуй скорей пока запутывает.

В результат акта замечания появляется заметка.

Результат пока крайне примитивен.

Но каждое следующее уточнение результата расширяет и усложняет заметку и должно происходить с помощью методов. Вопрос - класть эти методы в заметку?

note('something')

function note (something) {
  return function () {
    return something
  }
}

*/

function note1 (something) {
  return undefined
}

function note2 (something) {
  return something
}

function note3 (something) {
  return function () {
    return something
  }
}

function note4 (something) {
  return function (somethingElse) {
    if (!somethingElse) {
      return something
    } else {
      return note4(somethingElse)
    }
  }
}

function note5 (something) {
  return function (somethingElse) {
    if (!somethingElse) {
      return something
    } else {
      return note5(something + somethingElse)
    }
  }
}

function note6 (something, memory) {
  memory = memory || []
  return function (somethingElse) {
    if (!somethingElse) {
      return something
    } else {
      memory.push(something)
      return note6(somethingElse, memory)
    }
  }
}

// let n = note5('hey!')
// console.log(n(), n(), n('zok')('zak')('zuk')())

let n = note6('hola')
let k = n('bola')
let p = n('zola')
let t = p('bila')
console.log(n(), k(), p(), t())
// console.log(n(), n('hup')('hip')(), n('pip')('bip')())

export default {
  state: {
    mind: new Mind()
  },

  getters: {
    mind: state => state.mind
  }
}
