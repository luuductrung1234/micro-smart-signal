let SIGN_GO = 0
let SIGN_RIGHT = 1
let SIGN_LEFT = 2
let SIGN_BACK = 3
let SIGN_STOP = 4
let STREET_SIGN_MODE = 0
let REMOTE_MODE = 1
let mode = REMOTE_MODE
let step_01 = 0
let step_02 = 0
let step_03 = 0
let step_04 = 0
let is_run = 0
let speed = 30
//  ========================================
//  BASIC
//  ========================================
function on_start() {
    basic.showIcon(IconNames.Happy)
    radio.setGroup(2208061444)
}

basic.forever(function on_forever() {
    
    if (mode == STREET_SIGN_MODE) {
        basic.showString("S")
        send_street_sign()
    }
    
    if (mode == REMOTE_MODE) {
        basic.showString("R")
        send_remote_direction()
    }
    
    
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    if (mode == STREET_SIGN_MODE) {
        mode = REMOTE_MODE
        radio.sendValue("mode", mode)
        return
    }
    
    if (mode == REMOTE_MODE) {
        mode = STREET_SIGN_MODE
        radio.sendValue("mode", mode)
        return
    }
    
    
})
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (mode == STREET_SIGN_MODE) {
        change_steps()
        basic.showIcon(IconNames.Yes)
    }
    
    if (mode == REMOTE_MODE) {
        send_remote_run()
    }
    
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (mode == STREET_SIGN_MODE) {
        change_steps(-1)
        basic.showIcon(IconNames.Yes)
    }
    
    if (mode == REMOTE_MODE) {
        send_remote_speed()
    }
    
    
})
//  ========================================
//  REMOTE
//  ========================================
function send_remote_direction() {
    let x = input.acceleration(Dimension.X)
    let y = input.acceleration(Dimension.Y)
    // basic.show_number(x)
    // basic.show_number(y)
    if (x < -600) {
        radio.sendValue("dir", 1)
        basic.showLeds(`
            . . # . .
            . # . . .
            # # # # #
            . # . . .
            . . # . .
        `)
    }
    
    if (x > 600) {
        radio.sendValue("dir", 2)
        basic.showLeds(`
            . . # . .
            . . . # .
            # # # # #
            . . . # .
            . . # . .
        `)
    }
    
    if (y < -600) {
        radio.sendValue("dir", 3)
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
        `)
    }
    
    if (y > 600) {
        radio.sendValue("dir", 4)
        basic.showLeds(`
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
        `)
    }
    
    basic.pause(500)
}

function send_remote_run() {
    
    if (is_run == 0) {
        is_run = 1
    } else {
        is_run = 0
    }
    
    radio.sendValue("is_run", is_run)
    basic.showNumber(is_run)
    
}

function send_remote_speed() {
    
    if (speed == 100) {
        speed = 30
    } else {
        speed += 10
    }
    
    radio.sendValue("speed", speed)
    basic.showNumber(speed / 10)
    
}

//  ========================================
//  STREET SIGN
//  ========================================
function send_street_sign() {
    let instruction_value = "" + step_01 + ("" + step_02) + ("" + step_03) + ("" + step_04)
    radio.sendValue("steps", parseInt(instruction_value))
    // basic.show_string(instruction_value)
    basic.pause(200)
}

function change_steps(seed: number = 1) {
    
    
    
    
    if (seed > 0 && step_01 == SIGN_STOP && step_02 == SIGN_STOP && step_03 == SIGN_STOP && step_04 == SIGN_STOP) {
        step_01 = SIGN_GO
        step_02 = SIGN_GO
        step_03 = SIGN_GO
        step_04 = SIGN_GO
    }
    
    if (seed < 0 && step_01 == SIGN_GO && step_02 == SIGN_GO && step_03 == SIGN_GO && step_04 == SIGN_GO) {
        step_01 = SIGN_STOP
        step_02 = SIGN_STOP
        step_03 = SIGN_STOP
        step_04 = SIGN_STOP
    }
    
    if (step_01 != SIGN_STOP) {
        step_01 = step_01 + seed
        step_01 = step_01 > SIGN_STOP ? SIGN_STOP : step_01
        step_01 = step_01 < SIGN_GO ? SIGN_GO : step_01
        return
    }
    
    if (step_02 != SIGN_STOP) {
        step_02 += seed
        step_02 = step_02 > SIGN_STOP ? SIGN_STOP : step_02
        step_02 = step_02 < SIGN_GO ? SIGN_GO : step_02
        return
    }
    
    if (step_03 != SIGN_STOP) {
        step_03 += seed
        step_03 = step_03 > SIGN_STOP ? SIGN_STOP : step_03
        step_03 = step_03 < SIGN_GO ? SIGN_GO : step_03
        return
    }
    
    if (step_04 != SIGN_STOP) {
        step_04 += seed
        step_04 = step_04 > SIGN_STOP ? SIGN_STOP : step_04
        step_04 = step_04 < SIGN_GO ? SIGN_GO : step_04
    }
    
    
}

