# Comments

create user module
create storage module
save user module
save user module into memory (store state) for use later

all actions are gone through storage module
(maybe all module that want it)
listen through vuex actions/mutations
Maybe there will be inner action, which
brings in note in question. __createNote__,
which payload will have newly created note - for
anyone thatt need it. Or even two:
__createNoteBefore__ with input data
__createNoteAfter__ with output data
probably can pass accumulator - to possibly communicate
between modules

Get User Config from user config storage,
Init User Config storage for the first time.
Put it initially into ... anything
Prepare to change it.

# Алгоритм

Создаём системное хранилище. По ключу-коду. Достаём содержание заметки.

1. Она есть, читаем ключ-код хранилища пользователя
2. Его нет. Наши действия?

- Надо предложить создать пользователю? Гемор
- Надо иметь какой-то дефолт? Неплохо бы

Получается модуль приложения - это именно модуль, отвечает за создание хранилища пользователя.

Модуль пользователя - тоже компонент, входящиее данные которого - адрес хранилища.
