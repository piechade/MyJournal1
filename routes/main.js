var router = require('express').Router()
var ObjectId = require('mongoose').Types.ObjectId
var moment = require('moment')

var Post = require('../models/post')

router.get('/', function (req, res) {
  Post.find({}, function (err, posts) {
    if (err) {
      console.log(err)
    }
    var data = posts
    for (let index = 0; index < data.length; index++) {
      data[index].date2 = moment(data[index].date).format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
    res.render('home', {
      posts: data
    })
  })
})

router.get('/add-post', function (req, res) {
  res.render('post')
})

router.post('/add-post', function (req, res) {
  var post = new Post()

  post.title = req.body.title || ''
  post.content = req.body.content || ''
  post.date = moment(req.body.date, 'dddd, MMMM Do YYYY, h:mm:ss a') || new Date()
  // post.picture = req.files.image || ""

  post.save(function (err) {
    if (err) throw err
    res.redirect('/')
  })
})

router.get('/edit-post/:id', function (req, res) {
  Post.findOne({
    '_id': new ObjectId(req.params.id)
  }, function (err, post) {
    if (err) {
      console.log(err)
    }
    post.date2 = moment(post.date).format('dddd, MMMM Do YYYY, h:mm:ss a')
    res.render('edit', {
      post: post
    })
  })
})

router.post('/edit-post/:id', function (req, res) {
  Post.findOne({
    '_id': new ObjectId(req.params.id)
  }, function (err, post) {
    if (err) {
      console.log(err)
    }
    post.title = req.body.title || ''
    post.content = req.body.content || ''
    post.date = moment(req.body.date, 'dddd, MMMM Do YYYY, h:mm:ss a') || new Date()
    post.picture = req.body.image || ''

    post.save(function (err) {
      if (err) {
        console.log(err)
      }
      res.redirect('/')
    })
  })
})

router.get('/img', function (req, res) {
  var img = Buffer.from(req.body.img, 'base64')

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
  })
  res.end(img)
})

module.exports = router
