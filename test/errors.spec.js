var Vue = require('vue')
var Vuex = require('vuex')
var helpers = require('./helpers')
var VuexFire = require('../src')
/* eslint-disable no-native-reassign, no-global-assign */
window.Promise = require('promise-polyfill')

var firebaseApp = helpers.createFirebaseApp()

Vue.use(Vuex)
Vue.use(VuexFire)

describe('Errors', function () {
  var firebaseRef

  beforeEach(function (done) {
    helpers.createRef(firebaseApp)
      .then(function (ref) {
        firebaseRef = ref
        done()
      })
      .catch(done)
  })

  var store
  beforeEach(function () {
    store = new Vuex.Store({
      state: {
        items: []
      },
      getters: {
        items: function (state) { return state.items }
      },
      mutations: VuexFire.mutations
    })
  })

  it('throws error for invalid firebase ref', function () {
    helpers.invalidFirebaseRefs.forEach(function (ref) {
      expect(function () {
        new Vue({
          store: store,
          firebase: {
            items: ref
          }
        })
      }).to.throw('VuexFire: invalid Firebase binding source.')
    })
  })

  it('throws if vuex is not available', function () {
    expect(function () {
      new Vue({
        firebase: {}
      })
    }).to.throw('VuexFire: missing Vuex. Install Vuex before VuexFire')
  })

  it('throws when trying to binding to a non existing key', function () {
    expect(function () {
      new Vue({
        store: store,
        firebase: {
          foo: firebaseRef
        }
      })
    }).to.throw('VuexFire: bind failed: "foo" is not defined in the store state')
  })

  it('throws with wrong source')

  it('throws error given unbound key', function () {
    var vm = new Vue()
    expect(function () {
      vm.$unbind('items')
    }).to.throw(/not bound to a Firebase reference/)
  })
})
