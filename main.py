SIGN_GO = 0
SIGN_RIGHT = 1
SIGN_LEFT = 2
SIGN_BACK = 3
SIGN_STOP = 4

STREET_SIGN_MODE = 0
REMOTE_MODE = 1

mode = STREET_SIGN_MODE

step_01 = 0
step_02 = 0
step_03 = 0
step_04 = 0

is_run = 0
speed = 20

# ========================================
# BASIC
# ========================================

def on_start():
    basic.show_icon(IconNames.HAPPY)   
    radio.set_group(2208061444) 

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
        change_steps()
        basic.show_icon(IconNames.YES)
    if mode == REMOTE_MODE:
        send_remote_run()
    pass

def on_button_pressed_b():
    global mode
    if mode == STREET_SIGN_MODE:
        change_steps(-1)
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
    if x < -90:
        basic.show_leds("""
            . . # . .
            . # . . .
            # # # # #
            . # . . .
            . . # . .
        """)
        radio.send_value("direction", 1)
    if x > 90:
        basic.show_leds("""
            . . # . .
            . . . # .
            # # # # #
            . . . # .
            . . # . .
        """)
        radio.send_value("direction", 2)
    if y < -90:
        basic.show_leds("""
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
        """)
        radio.send_value("direction", 3)
    if y > 90:
        basic.show_leds("""
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
        """)
        radio.send_value("direction", 4)
    basic.pause(500)

def send_remote_run():
    global is_run
    if is_run == 0:
        is_run = 1
    else:
        is_run = 0
    basic.show_number(is_run)
    radio.send_value("is_run", is_run)
    pass

def send_remote_speed():
    global speed
    if speed == 100:
        speed = 20
    else:
        speed += 10
    basic.show_number(speed)
    radio.send_value("speed", speed)
    pass

# ========================================
# STREET SIGN
# ========================================

def send_street_sign():
    instruction_value = str(step_01) + str(step_02) + str(step_03) + str(step_04)
    radio.send_value("steps", int(instruction_value))
    #basic.show_string(instruction_value)
    basic.pause(200)

def change_steps(seed = 1):
    global step_01
    global step_02
    global step_03
    global step_04
    if seed > 0 and step_01 == SIGN_STOP and step_02 == SIGN_STOP and step_03 == SIGN_STOP and step_04 == SIGN_STOP:
        step_01 = SIGN_GO
        step_02 = SIGN_GO
        step_03 = SIGN_GO
        step_04 = SIGN_GO
    if seed < 0 and step_01 == SIGN_GO and step_02 == SIGN_GO and step_03 == SIGN_GO and step_04 == SIGN_GO:
        step_01 = SIGN_STOP
        step_02 = SIGN_STOP
        step_03 = SIGN_STOP
        step_04 = SIGN_STOP
    if step_01 != SIGN_STOP:
        step_01 = step_01 + seed
        step_01 = SIGN_STOP if step_01 > SIGN_STOP else step_01
        step_01 = SIGN_GO if step_01 < SIGN_GO else step_01
        return
    if step_02 != SIGN_STOP:
        step_02 += seed
        step_02 = SIGN_STOP if step_02 > SIGN_STOP else step_02
        step_02 = SIGN_GO if step_02 < SIGN_GO else step_02
        return
    if step_03 != SIGN_STOP:
        step_03 += seed
        step_03 = SIGN_STOP if step_03 > SIGN_STOP else step_03
        step_03 = SIGN_GO if step_03 < SIGN_GO else step_03
        return
    if step_04 != SIGN_STOP:
        step_04 += seed
        step_04 = SIGN_STOP if step_04 > SIGN_STOP else step_04
        step_04 = SIGN_GO if step_04 < SIGN_GO else step_04
    pass
