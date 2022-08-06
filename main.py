SIGN_GO = 0
SIGN_RIGHT = 1
SIGN_LEFT = 2
SIGN_BACK = 3
SIGN_STOP = 4

step_01 = 0
step_02 = 0
step_03 = 0
step_04 = 0

def change_steps(seed = 1):
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
        step_01 += seed
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

def send_street_sign():
    instruction_value = int(str(step_01) + str(step_02) + str(step_03) + str(step_04))
    radio.send_value("instruction", instruction_value)
    basic.show_string(str(instruction_value))
    basic.pause(200)

# ========================================
# BASIC
# ========================================

def on_start():
    basic.show_icon(IconNames.HAPPY)   
    radio.set_group(2) 

def on_forever():
    basic.show_string("S") # Street Sign
    send_street_sign()
    
basic.forever(on_forever)

# ========================================
# BUTTON
# ========================================

def on_button_pressed_a():
    change_steps()

def on_button_pressed_b():
    change_steps(-1)

input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)