// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
// require express-handlebars here
const exphbs = require('express-handlebars')
const restaurantList = require('./models/seeds/restaurant.json').results
const bodyParser = require('body-parser')
// 載入Restaurant model
const Restaurant = require('./models/restaurant')

// 設定連線到 mongoDB
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb erroe!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

// --------routes setting--------
// 顯示所有餐廳資料
app.get('/', (req, res) => {
  Restaurant.find() //取出model內的所有資料
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})
// 新增餐廳
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})
app.post('/restaurants', (req, res) => {
  const name = req.body.name
  return Restaurant.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// 顯示單一餐廳資料
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})
// 顯示搜尋結果
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

