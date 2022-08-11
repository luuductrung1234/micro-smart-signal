let STREET_SIGN_MODE = 0
let REMOTE_MODE = 1
let mode = STREET_SIGN_MODE
let street_sign_id = "S1"
let is_start_receive_ticket = false
let is_run = 0
let speed = 30
let current_delivery = ""
//  ========================================
//  BASIC
//  ========================================
function on_start() {
    radio.setGroup(2208061444)
    esp8266.init(SerialPin.P16, SerialPin.P15, BaudRate.BaudRate115200)
    if (esp8266.isESP8266Initialized()) {
        basic.showIcon(IconNames.Yes)
        basic.pause(200)
    } else {
        basic.showIcon(IconNames.No)
        return
    }
    
    esp8266.connectWiFi("Tom Luu", "Trung1997")
    // esp8266.connect_wi_fi("Trung", "Trung1997")
    if (esp8266.isWifiConnected()) {
        basic.showIcon(IconNames.Happy)
        basic.pause(200)
    } else {
        basic.showIcon(IconNames.Sad)
        return
    }
    
}

on_start()
basic.forever(function on_forever() {
    
    
    
    if (mode == STREET_SIGN_MODE) {
        basic.showString(street_sign_id)
        if (is_start_receive_ticket) {
            send_street_sign()
        }
        
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
        if (street_sign_id == "S1") {
            street_sign_id = "S2"
        } else if (street_sign_id == "S2") {
            street_sign_id = "S3"
        } else if (street_sign_id == "S3") {
            street_sign_id = "S1"
        }
        
        basic.showIcon(IconNames.Yes)
    }
    
    if (mode == REMOTE_MODE) {
        send_remote_run()
    }
    
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    
    if (mode == STREET_SIGN_MODE) {
        is_start_receive_ticket = !is_start_receive_ticket
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
    
    if (!esp8266.isWifiConnected()) {
        return
    }
    
    let response = esp8266.pickRequest()
    if (response === null || current_delivery == response) {
        return
    }
    
    current_delivery = response
    let decoded_path = parse_location(current_delivery)
    basic.showString(decoded_path)
    radio.sendString(decoded_path)
    basic.pause(500)
}

function parse_location(location: string): string {
    
    if (street_sign_id == "S1" && location.indexOf("s1") >= 0) {
        location = location.replace("s1", "1,l,3")
    }
    
    if (street_sign_id == "S1" && location.indexOf("s2") >= 0) {
        location = location.replace("s1", "l,3,r,2")
    }
    
    if (street_sign_id == "S2" && location.indexOf("u2") >= 0) {
        location = location.replace("u2", "l,3")
    }
    
    if (street_sign_id == "S3" && location.indexOf("u3") >= 0) {
        location = location.replace("u3", "r,3")
    }
    
    return location
}

