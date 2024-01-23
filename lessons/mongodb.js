show dbs //посмотреть базы данных
use db_name //использовать базу

//Для возврата нескольких элементов
db.collection_name.find()
db.collection_name.find({key: value, key: value})
db.collection_name.find({key: value, key: value}, {title: 1, director: 1}) //указываем какие поля хотим получить
db.collection_name.find({}, {title: 1, director: 1})
db.collection_name.find({}, {}).limit(5) // ограничение на получение количества элементов
db.collection_name.find({}, {}).sort(rating: 1)

//Только 1 конкретный элемент
db.collection_name.findOne({_id: ObjectId(“dfsdfsdfsdf”) }) //всегда передаем айди
db.collection_name.findOne({_id: ObjectId(“dfsdfsdfsdf”) }, {}) 
deleteOne // удалит первый найденный
deleteMany //удалит все совпавшие

//операторы
db.collection_name.find({rating:{ $gt: 9 }}) //больше 9 great then
db.collection_name.find({rating:{ $lt: 9 }}) //меньше 9, less then
db.collection_name.find({rating:{ $gte: 9 }}) //больше 9 great then eqvale или равно
db.collection_name.find({rating:{ $lte: 9 }}) //меньше 9, less then eqvale или равно
db.collection_name.find({rating:{ $eq: 9 }}) //равно 9
db.collection_name.find({rating:{ $ne: 9 }}) //не равно 9
db.collection_name.find($or [{key: value}, {key: value}]) //или
db.collection_name.find(rating: {$in [8, 9, 10]}) //вхождение в массив
db.collection_name.find(rating: {$nin [8, 9, 10]}) //не входит в массив

//Удаление
db.collection_name.drop() //удаление коллекции
db.dropDatabase(); //удаление всей базы

//Обновление данных
db.collection.replaceOne(filter, update, options) //замена одного документа другим, обязательно менять все поля которые были
db.users.replaceOne({name: "Bob"}, {name: "Bob", age: 25})

//updateOne, updateMany
db.users.updateOne({name : "Tom", age: 22}, {$set: {age : 28}})
db.users.updateMany({name : "Tom"}, {$set: {name : "Tomas"}})
//Если добавляемого поля нет, то оно создастя
db.users.updateOne({name : "Tom", age: 28}, {$set: {salary : 300}})
//Если надо добавить несколько новых полей
db.users.updateOne({name : "Tom"}, {$set: {name: "Tomas", age : 25}})
//Для простого увеличения значения числового поля на определенное количество единиц применяется оператор $inc. Если документ не содержит обновляемое поле, то оно создается. Данный оператор применим только к числовым значениям.
db.users.updateOne({name : "Tom"}, {$inc: {age:2}})

//Удаление поля
{$unset: {salary: 1, age: 1}}

//Ограниченные коллекции
//Например, создадим ограниченную коллекцию с названием profiles и зададим для нее размер в 9500 байт:
db.createCollection("profiles", {capped:true, size:9500})
//Также можно ограничить количество документов в коллекции, указав его в параметре max:
db.createCollection("profiles", {capped:true, size:9500, max: 150})

//При обновлении документов в таких коллекциях надо помнить, что документы не должны расти в размерах, иначе обновление не удастся произвести.
//Также нельзя удалять документы из подобных коллекций, можно только удалить всю коллекцию.
