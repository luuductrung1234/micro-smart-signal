let SIGN_GO = 0
let SIGN_RIGHT = 1
let SIGN_LEFT = 2
let SIGN_BACK = 3
let SIGN_STOP = 4
let step_01 = 0
let step_02 = 0
let step_03 = 0
let step_04 = 0
//  ========================================
//  BASIC
//  ========================================
function on_start() {
    basic.showIcon(IconNames.Happy)
    radio.setGroup(2208061444)
}

basic.forever(function on_forever() {
    basic.showString("S")
    //  Street Sign
    send_street_sign()
})
//  ========================================
//  MAIN
//  ========================================
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

function send_street_sign() {
    let instruction_value = "" + step_01 + ("" + step_02) + ("" + step_03) + ("" + step_04)
    radio.sendValue("instruction", parseInt(instruction_value))
    // basic.show_string(instruction_value)
    basic.pause(200)
}

//  ========================================
//  BUTTON
//  ========================================
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    change_steps()
    basic.showIcon(IconNames.Yes)
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    change_steps(-1)
    basic.showIcon(IconNames.Yes)
})
