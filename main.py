STREET_SIGN_MODE = 0
REMOTE_MODE = 1

mode = STREET_SIGN_MODE

is_run = 0
speed = 30

current_delivery = ""

# ========================================
# BASIC
# ========================================

def on_start(): 
    radio.set_group(2208061444) 
    esp8266.init(SerialPin.P16, SerialPin.P15, BaudRate.BAUD_RATE115200)
    if esp8266.is_esp8266_initialized():
        basic.show_icon(IconNames.YES)
        basic.pause(200)
    else:
        basic.show_icon(IconNames.NO)
        return
    esp8266.connect_wi_fi("Tom Luu", "Trung1997")
    #esp8266.connect_wi_fi("Trung", "Trung1997")
    if esp8266.is_wifi_connected():
        basic.show_icon(IconNames.HAPPY)
        basic.pause(200)
    else:
        basic.show_icon(IconNames.SAD)
        return

def on_forever():
    global mode
    if mode == STREET_SIGN_MODE:
        basic.show_string("S")
        send_street_sign()
    if mode == REMOTE_MODE:
        basic.show_string("R")
        send_remote_direction()
    pass

def on_button_pressed_a():
    global mode
    if mode == STREET_SIGN_MODE:
        basic.show_icon(IconNames.YES)
    if mode == REMOTE_MODE:
        send_remote_run()
    pass

def on_button_pressed_b():
    global mode
    if mode == STREET_SIGN_MODE:
        basic.show_icon(IconNames.YES)
    if mode == REMOTE_MODE:
        send_remote_speed()
    pass

def on_button_pressed_ab():
    global mode
    if mode == STREET_SIGN_MODE:
        mode = REMOTE_MODE
        radio.send_value("mode", mode)
        return
    if mode == REMOTE_MODE:
        mode = STREET_SIGN_MODE
        radio.send_value("mode", mode)
        return;
    pass

on_start()
basic.forever(on_forever)
input.on_button_pressed(Button.AB, on_button_pressed_ab)
input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)

# ========================================
# REMOTE
# ========================================

def send_remote_direction():
    x = input.acceleration(Dimension.X)
    y = input.acceleration(Dimension.Y)
    #basic.show_number(x)
    #basic.show_number(y)
    if x < -600:
        radio.send_value("dir", 1)
        basic.show_leds("""
            . . # . .
            . # . . .
            # # # # #
            . # . . .
            . . # . .
        """)
    if x > 600:
        radio.send_value("dir", 2)
        basic.show_leds("""
            . . # . .
            . . . # .
            # # # # #
            . . . # .
            . . # . .
        """)
    if y < -600:
        radio.send_value("dir", 3)
        basic.show_leds("""
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
        """)
    if y > 600:
        radio.send_value("dir", 4)
        basic.show_leds("""
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
        """)
    basic.pause(500)

def send_remote_run():
    global is_run
    if is_run == 0:
        is_run = 1
    else:
        is_run = 0
    radio.send_value("is_run", is_run)
    basic.show_number(is_run)
    pass

def send_remote_speed():
    global speed
    if speed == 100:
        speed = 30
    else:
        speed += 10
    radio.send_value("speed", speed)
    basic.show_number(speed/10)
    pass

# ========================================
# STREET SIGN
# ========================================

def send_street_sign():
    global current_delivery
    if not esp8266.is_wifi_connected():
        return
    response = esp8266.pick_request()
    if response is None or current_delivery == response:
        return
    current_delivery = response
    decoded_path = parse_location(current_delivery)
    basic.show_string(decoded_path)
    radio.send_string(decoded_path)
    basic.pause(500)

def parse_location(location: string):
    if "s1" in location:
        location = location.replace("s1", "1,l,3")
    if "s2" in location:
        location = location.replace("s1", "l,3,r,2")
    return location