// Loads init function after page is ready

(function() {
  let state = {
    break: 1,
    duration: moment.duration(),
    lock: false,
    session: 1,
    type: 'session'
  }

  const controls = (e) => {
    if (e.target !== e.currentTarget && e.target.nodeName === 'BUTTON') {
      if (e.target.className === 'b-btn') {
        if (e.target.innerHTML === '-') {
          if (state.break > 0) {
            state.break -= 1
          }
        } else { // +
          if (state.break < 100) {
            state.break += 1
          }
        }

        document.querySelector('#break').innerHTML = state.break
      } else { // s-btn
        if (e.target.innerHTML === '-') {
          if (state.session > 0) {
            state.session -= 1
          }
        } else { // +
          if (state.session < 90) {
            state.session += 1
          }
        }

        document.querySelector('#time').innerHTML = 
          document.querySelector('#session').innerHTML = state.session
      }
    }

    resetTimer()
  }

  const resetTimer = () => {
    clearInterval(myInt)
    state.duration = moment.duration()
    document.querySelector('#timeTitle').innerHTML = 'Session'
    document.querySelector('#time').innerHTML = state.session
    document.querySelector('#start').innerHTML = 'Start Timer'
    state.type = 'session'
    state.lock = false
    document.querySelector('body').style.backgroundColor = 'white'
  } 

  const startPause = (e) => {
    if (e.target.innerHTML === 'Start Timer') {
      e.target.innerHTML = 'Pause Timer'
      initTimer()
    } else {
      e.target.innerHTML = 'Start Timer'
      clearInterval(myInt)
      state.lock = true
    }
  }

  const initTimer = () => { 
    if (!state.lock) {
      if (state.type === 'session') {
        document.querySelector('body').style.backgroundColor = 'green'
        document.querySelector('#timeTitle').innerHTML = 'Session'
        const end = moment().add(state.session, 'minutes') // change duration here
        const current = moment()
    
        let diff = end - current
        state.duration = moment.duration(diff, 'milliseconds')
      } else {
        document.querySelector('body').style.backgroundColor = 'red'
        document.querySelector('#timeTitle').innerHTML = 'Break'
        const end = moment().add(state.break, 'minutes') // change duration here
        const current = moment()
    
        let diff = end - current
        state.duration = moment.duration(diff, 'milliseconds')
      }
    } else {
      const end = moment().add(state.duration) // change duration here
      const current = moment()
  
      let diff = end - current

      state.duration = moment.duration(diff, 'milliseconds')
      state.lock = false
    }

    startTimer(state.duration)
  }

  // The timer is an interval that repeats every 1000ms
  //   and is cleared after the duration is below 1s
  const startTimer = () => {    
    myInt = setInterval(() => {
      state.duration = moment.duration(state.duration - 1000, 'milliseconds')

      document.querySelector('#time').innerHTML = moment(state.duration._data).format('mm:ss')

      console.log(state.duration)

      if (state.duration.minutes() < 1 && state.duration.seconds() < 1) {
        console.log('fell through')
        document.querySelector('#time').innerHTML = '00:00'

        clearInterval(myInt)

        if (state.type === 'session') {
          state.type = 'break'
        } else {
          state.type = 'session'
        }

        initTimer()
      }
    }, 1000)
  }
  
  // Event Listeners
  const parent = document.querySelector('#controls')
  const start = document.querySelector('#start')
  const reset = document.querySelector('#reset')
  let myInt = 0

  parent.addEventListener('click', controls, false)
  start.addEventListener('click', startPause, false)
  reset.addEventListener('click', resetTimer, false)
})()